#!/usr/bin/env bash
# Pulls the latest schema from Neon into schema/.
#
# schema/tables/<table>.sql   one file per table, in this order:
#                               1. Table DDL (columns, defaults, CHECK / NOT NULL)
#                               2. Constraints (PK, UNIQUE, EXCLUDE, then FK)
#                               3. Indexes (those not created by a constraint)
#                               4. Trigger functions used by this table
#                               5. Triggers
# schema/types.sql            enums
# schema/functions.sql        functions NOT used by any trigger (RPCs, uuid_generate_v7, ...)

# load env
ENV_FILE="${ENV_FILE:-.env}"
if [[ -z "${DATABASE_URL:-}" && -f "$ENV_FILE" ]]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$ENV_FILE" | head -n1 | cut -d= -f2- | sed -E "s/^['\"]//; s/['\"]$//")"
  export DATABASE_URL
fi

set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to your Neon direct connection string first}"

OUT=schema
rm -rf "$OUT/tables"          # so dropped tables disappear from the repo
mkdir -p "$OUT/tables"

# ---------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------

# Run SQL from stdin against the DB. The table name is available in the SQL
# as the psql variable :'tbl'.
# search_path is emptied so every name comes out schema-qualified (public.x).
q() { { echo "SET search_path = '';"; cat; } | psql "$DATABASE_URL" -X -Atq -v ON_ERROR_STOP=1 -v tbl="$1"; }

# Strip pg_dump noise (comments, SET, set_config, \restrict) so git diffs stay
# clean. Only used on pg_dump output, never on function bodies.
clean_dump() {
  sed -E '/^--/d; /^SET /d; /set_config/d; /^\\(un)?restrict /d' | cat -s | sed '/./,$!d'
}

# Print a titled section from stdin; print nothing if stdin is empty.
section() {
  local title="$1" body
  body="$(cat)"
  [[ -n "${body//[[:space:]]/}" ]] || return 0
  printf -- '-- ---------------------------------------------------------------------\n'
  printf -- '-- %s\n' "$title"
  printf -- '-- ---------------------------------------------------------------------\n'
  printf -- '%s\n\n' "$body"
}

# ---------------------------------------------------------------------
# One file per table
# ---------------------------------------------------------------------
while IFS= read -r t <&3; do
  {
    printf -- '-- Table: public.%s\n\n' "$t"

    # 1. Table DDL
    pg_dump "$DATABASE_URL" --schema-only --section=pre-data --no-owner --no-privileges \
      --table="public.\"$t\"" | clean_dump | section "Table"

    # 2. Constraints (CHECK and NOT NULL are already inline in the CREATE TABLE)
    q "$t" <<'SQL' | section "Constraints"
SELECT format('ALTER TABLE ONLY %s ADD CONSTRAINT %I %s;',
              format('public.%I', :'tbl'), c.conname, pg_get_constraintdef(c.oid))
FROM pg_constraint c
WHERE c.conrelid = format('public.%I', :'tbl')::regclass
  AND c.contype IN ('p', 'u', 'x', 'f')
ORDER BY CASE c.contype WHEN 'p' THEN 1 WHEN 'u' THEN 2 WHEN 'x' THEN 3 ELSE 4 END,
         c.conname;
SQL

    # 3. Indexes (PK / UNIQUE / EXCLUDE indexes already come from the constraints)
    q "$t" <<'SQL' | section "Indexes"
SELECT pg_get_indexdef(i.indexrelid) || ';'
FROM pg_index i
JOIN pg_class ic ON ic.oid = i.indexrelid
WHERE i.indrelid = format('public.%I', :'tbl')::regclass
  AND NOT EXISTS (SELECT 1 FROM pg_constraint c
                  WHERE c.conindid = i.indexrelid AND c.contype IN ('p', 'u', 'x'))
ORDER BY ic.relname;
SQL

    # 4. Trigger functions used by this table's triggers
    q "$t" <<'SQL' | section "Functions"
SELECT rtrim(pg_get_functiondef(p.oid), E'\n') || ';' || E'\n'
FROM pg_proc p
WHERE p.oid IN (SELECT tg.tgfoid FROM pg_trigger tg
                WHERE tg.tgrelid = format('public.%I', :'tbl')::regclass
                  AND NOT tg.tgisinternal)
  AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')
ORDER BY p.proname;
SQL

    # 5. Triggers
    q "$t" <<'SQL' | section "Triggers"
SELECT pg_get_triggerdef(tg.oid, true) || ';'
FROM pg_trigger tg
WHERE tg.tgrelid = format('public.%I', :'tbl')::regclass
  AND NOT tg.tgisinternal
ORDER BY tg.tgname;
SQL
  } > "$OUT/tables/$t.sql"
done 3< <(psql "$DATABASE_URL" -X -Atc \
  "select tablename from pg_tables where schemaname='public' order by 1")

# ---------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------
psql "$DATABASE_URL" -Atc "
  select 'CREATE TYPE public.' || t.typname || ' AS ENUM (' ||
         string_agg(quote_literal(e.enumlabel), ', ' order by e.enumsortorder) || ');'
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  group by t.typname
  order by t.typname;" > "$OUT/types.sql"

# ---------------------------------------------------------------------
# Standalone functions (RPCs, uuid_generate_v7, ...).
# Excludes extension-owned functions and trigger functions, which now live
# in their table's file.
# ---------------------------------------------------------------------
psql "$DATABASE_URL" -Atc "
  select rtrim(pg_get_functiondef(p.oid), E'\n') || ';' || E'\n'
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.prokind = 'f'
    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
    and not exists (select 1 from pg_trigger tg where tg.tgfoid = p.oid and not tg.tgisinternal)
  order by p.proname;" > "$OUT/functions.sql"

echo "Schema pulled into $OUT/"