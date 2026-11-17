# bash script for pulling the latest schema from neon such as DD: of the entity, constraints, indexes, and the functions

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

# One file per table (includes its indexes, constraints, triggers)
for t in $(psql "$DATABASE_URL" -Atc \
  "select tablename from pg_tables where schemaname='public' order by 1"); do
  pg_dump "$DATABASE_URL" --schema-only --no-owner --no-privileges \
    --table="public.$t" -f "$OUT/tables/$t.sql"
done

# Enums
psql "$DATABASE_URL" -Atc "
  select 'CREATE TYPE public.' || t.typname || ' AS ENUM (' ||
         string_agg(quote_literal(e.enumlabel), ', ' order by e.enumsortorder) || ');'
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
  group by t.typname
  order by t.typname;" > "$OUT/types.sql"

# Functions (RPCs, trigger functions, uuid_generate_v7), excluding extension-owned ones
psql "$DATABASE_URL" -Atc "
  select pg_get_functiondef(p.oid) || ';' || E'\n'
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.prokind = 'f'
    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
  order by p.proname;" > "$OUT/functions.sql"

# Strip pg_dump noise so git diffs stay clean
sed -i -E '/^SET /d; /set_config/d; /^\\(un)?restrict /d' "$OUT"/tables/*.sql

echo "Schema pulled into $OUT/"