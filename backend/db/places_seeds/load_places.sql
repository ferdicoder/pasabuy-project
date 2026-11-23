-- load_places.sql
-- Loads regions.csv, provinces.csv and places.csv (from psgc_export.py) into the
-- places tables. Idempotent: safe to re-run for each PSGC update.
--   * upserts by PSGC code (renames and moved coordinates are picked up)
--   * codes that disappear from the files are marked is_active = false, never
--     deleted, so old trips/requests keep a valid reference
--   * rebuilds the proximity graph, seeds aliases, and backfills trips/requests
--     that only have the old free-text locations (unambiguous names only)
--
-- Run from THIS folder (\copy paths are relative):
--     cd places_seed && psql "$DATABASE_URL" -f load_places.sql
\set ON_ERROR_STOP on
\encoding UTF8

BEGIN;

CREATE TEMP TABLE stage_regions   (psgc_code text, name text, island_group text) ON COMMIT DROP;
CREATE TEMP TABLE stage_provinces (psgc_code text, name text, region_code text) ON COMMIT DROP;
CREATE TEMP TABLE stage_places    (psgc_code text, name text, kind text, region_code text,
                                   province_code text, lat numeric, lng numeric,
                                   population integer) ON COMMIT DROP;

\copy stage_regions   FROM 'regions.csv'   WITH (FORMAT csv, HEADER true)
\copy stage_provinces FROM 'provinces.csv' WITH (FORMAT csv, HEADER true)
\copy stage_places    FROM 'places.csv'    WITH (FORMAT csv, HEADER true)

-- Regions
INSERT INTO public.regions (psgc_code, name, island_group)
SELECT psgc_code, name, island_group FROM stage_regions
ON CONFLICT (psgc_code) DO UPDATE
   SET name = EXCLUDED.name, island_group = EXCLUDED.island_group,
       is_active = true, updated_at = now();
UPDATE public.regions SET is_active = false, updated_at = now()
 WHERE is_active AND psgc_code NOT IN (SELECT psgc_code FROM stage_regions);

-- Provinces
INSERT INTO public.provinces (psgc_code, name, region_code)
SELECT psgc_code, name, region_code FROM stage_provinces
ON CONFLICT (psgc_code) DO UPDATE
   SET name = EXCLUDED.name, region_code = EXCLUDED.region_code,
       is_active = true, updated_at = now();
UPDATE public.provinces SET is_active = false, updated_at = now()
 WHERE is_active AND psgc_code NOT IN (SELECT psgc_code FROM stage_provinces);

-- Places
INSERT INTO public.places
       (psgc_code, name, kind, region_code, province_code, lat, lng, population,
        search_name, exact_name)
SELECT psgc_code, name, kind::public.place_kind, region_code, NULLIF(province_code, ''),
       lat, lng, population,
       public.normalize_place_name(name), public.normalize_place_name_exact(name)
  FROM stage_places
ON CONFLICT (psgc_code) DO UPDATE
   SET name = EXCLUDED.name, kind = EXCLUDED.kind, region_code = EXCLUDED.region_code,
       province_code = EXCLUDED.province_code, lat = EXCLUDED.lat, lng = EXCLUDED.lng,
       population = EXCLUDED.population, search_name = EXCLUDED.search_name,
       exact_name = EXCLUDED.exact_name, is_active = true, updated_at = now();
UPDATE public.places SET is_active = false, updated_at = now()
 WHERE is_active AND psgc_code NOT IN (SELECT psgc_code FROM stage_places);

-- Aliases (looked up by official name, so a renamed/removed place just skips).
-- Add your own: INSERT INTO place_aliases ... (alias must be normalized, see
-- normalize_place_name()).
INSERT INTO public.place_aliases (alias, psgc_code)
SELECT v.alias, p.psgc_code
  FROM (VALUES ('qc',     'Quezon City'),
               ('cdo',    'City of Cagayan De Oro'),
               ('gensan', 'City of General Santos'),
               ('bgc',    'City of Taguig')) AS v(alias, official_name)
  JOIN public.places p ON p.name = v.official_name
ON CONFLICT DO NOTHING;

-- Proximity graph (60 km build radius; 13_match_by_place.sql caps matching at 30 km)
SELECT public.rebuild_place_proximity(60) AS proximity_rows;

-- Backfill from the old free-text columns, only where resolve_place() finds exactly
-- ONE place (names like "San Jose" are ambiguous and are left for the user to pick).
UPDATE public.requests SET from_place_code = public.resolve_place(origin)
 WHERE from_place_code IS NULL;
UPDATE public.requests SET to_place_code = public.resolve_place(delivery_location)
 WHERE to_place_code IS NULL;
UPDATE public.trips SET from_place_code = public.resolve_place(current_location)
 WHERE from_place_code IS NULL;
UPDATE public.trips SET to_place_code = public.resolve_place(destination)
 WHERE to_place_code IS NULL;

COMMIT;

-- Summary
SELECT (SELECT count(*) FROM public.regions   WHERE is_active) AS regions,
       (SELECT count(*) FROM public.provinces WHERE is_active) AS provinces,
       (SELECT count(*) FROM public.places    WHERE is_active) AS places,
       (SELECT count(*) FROM public.place_proximity)           AS proximity_pairs;
SELECT 'requests still without places (fix before 14_places_enforce.sql)' AS note,
       count(*) AS n FROM public.requests WHERE from_place_code IS NULL OR to_place_code IS NULL;
SELECT 'trips still without places (fix before 14_places_enforce.sql)' AS note,
       count(*) AS n FROM public.trips WHERE from_place_code IS NULL OR to_place_code IS NULL;