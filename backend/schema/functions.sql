CREATE OR REPLACE FUNCTION public.haversine_km(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
 RETURNS double precision
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  SELECT 2 * 6371.0088 * asin(least(1.0, sqrt(
           power(sin(radians(lat2 - lat1) / 2), 2)
         + cos(radians(lat1)) * cos(radians(lat2))
           * power(sin(radians(lng2 - lng1) / 2), 2))))
$function$;

CREATE OR REPLACE FUNCTION public.match_today()
 RETURNS date
 LANGUAGE sql
 STABLE
AS $function$ SELECT (now() AT TIME ZONE 'Asia/Manila')::date $function$;

CREATE OR REPLACE FUNCTION public.normalize_place_name(p_name text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  SELECT btrim(
           regexp_replace(
             regexp_replace(
               btrim(regexp_replace(
                       translate(lower(p_name),
                                 'ñáàâäéèêëíìîïóòôöúùûü',
                                 'naaaaeeeeiiiioooouuuu'),
                       '[^a-z0-9]+', ' ', 'g')),
               '^(city of|municipality of) ', ''),
             ' city$', ''))
$function$;

CREATE OR REPLACE FUNCTION public.normalize_place_name_exact(p_name text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
AS $function$
  SELECT btrim(regexp_replace(
           translate(lower(p_name),
                     'ñáàâäéèêëíìîïóòôöúùûü',
                     'naaaaeeeeiiiioooouuuu'),
           '[^a-z0-9]+', ' ', 'g'))
$function$;

CREATE OR REPLACE FUNCTION public.process_match_outbox()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_type text;
  v_id   uuid;
BEGIN
  DELETE FROM public.match_outbox
   WHERE outbox_id IN (SELECT outbox_id
                         FROM public.match_outbox
                        ORDER BY outbox_id
                          FOR UPDATE SKIP LOCKED
                        LIMIT 1)
  RETURNING entity_type, entity_id INTO v_type, v_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  BEGIN
    IF v_type = 'request' THEN
      PERFORM public.refresh_candidates_for_request(v_id);
    ELSE
      PERFORM public.refresh_candidates_for_trip(v_id);
    END IF;
  EXCEPTION
    WHEN deadlock_detected OR serialization_failure THEN
      RAISE;
    WHEN OTHERS THEN
      INSERT INTO public.match_outbox_dead (entity_type, entity_id, error)
      VALUES (v_type, v_id, SQLERRM);
  END;

  RETURN 1;
END $function$;

CREATE OR REPLACE FUNCTION public.rebuild_place_proximity(p_max_km numeric DEFAULT 60)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_rows bigint;
BEGIN
  DELETE FROM public.place_proximity;   -- one transaction: readers never see it empty
  INSERT INTO public.place_proximity (place_code, near_code, distance_km)
  SELECT a.psgc_code, b.psgc_code,
         round(public.haversine_km(a.lat::float8, a.lng::float8, b.lat::float8, b.lng::float8)::numeric, 2)
    FROM public.places a
    JOIN public.places b
      ON abs(a.lat - b.lat) <= p_max_km / 111.0          -- cheap bounding-box prefilter
     AND public.haversine_km(a.lat::float8, a.lng::float8, b.lat::float8, b.lng::float8) <= p_max_km
   WHERE a.is_active AND b.is_active;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END $function$;

CREATE OR REPLACE FUNCTION public.refresh_candidates_for_request(p_request_id uuid, p_limit integer DEFAULT 20)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_changed integer;
BEGIN
  INSERT INTO public.match_candidates
         (request_id, trip_id, score, score_parts, score_version)
  SELECT top.request_id, top.trip_id, top.score, top.score_parts, top.score_version
    FROM (SELECT v.request_id, v.trip_id, v.score, v.score_parts, v.score_version
            FROM public.v_match_pairs v
           WHERE v.request_id = p_request_id
           ORDER BY v.score DESC, v.trip_id
           LIMIT p_limit) top
   ORDER BY top.request_id, top.trip_id
  ON CONFLICT (request_id, trip_id) DO UPDATE
     SET score         = EXCLUDED.score,
         score_parts   = EXCLUDED.score_parts,
         score_version = EXCLUDED.score_version,
         updated_at    = now()
   WHERE (match_candidates.score, match_candidates.score_version)
         IS DISTINCT FROM (EXCLUDED.score, EXCLUDED.score_version);
  GET DIAGNOSTICS v_changed = ROW_COUNT;

  DELETE FROM public.match_candidates mc
   WHERE mc.request_id = p_request_id
     AND mc.buyer_dismissed_at IS NULL
     AND mc.traveler_dismissed_at IS NULL
     AND mc.consumed_at IS NULL
     AND NOT EXISTS (SELECT 1 FROM public.v_match_pairs v
                      WHERE v.request_id = mc.request_id
                        AND v.trip_id    = mc.trip_id);

  RETURN v_changed;
END $function$;

CREATE OR REPLACE FUNCTION public.refresh_candidates_for_trip(p_trip_id uuid, p_limit integer DEFAULT 50)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_changed integer;
BEGIN
  INSERT INTO public.match_candidates
         (request_id, trip_id, score, score_parts, score_version)
  SELECT top.request_id, top.trip_id, top.score, top.score_parts, top.score_version
    FROM (SELECT v.request_id, v.trip_id, v.score, v.score_parts, v.score_version
            FROM public.v_match_pairs v
           WHERE v.trip_id = p_trip_id
           ORDER BY v.score DESC, v.request_id
           LIMIT p_limit) top
   ORDER BY top.request_id, top.trip_id
  ON CONFLICT (request_id, trip_id) DO UPDATE
     SET score         = EXCLUDED.score,
         score_parts   = EXCLUDED.score_parts,
         score_version = EXCLUDED.score_version,
         updated_at    = now()
   WHERE (match_candidates.score, match_candidates.score_version)
         IS DISTINCT FROM (EXCLUDED.score, EXCLUDED.score_version);
  GET DIAGNOSTICS v_changed = ROW_COUNT;

  DELETE FROM public.match_candidates mc
   WHERE mc.trip_id = p_trip_id
     AND mc.buyer_dismissed_at IS NULL
     AND mc.traveler_dismissed_at IS NULL
     AND mc.consumed_at IS NULL
     AND NOT EXISTS (SELECT 1 FROM public.v_match_pairs v
                      WHERE v.request_id = mc.request_id
                        AND v.trip_id    = mc.trip_id);

  RETURN v_changed;
END $function$;

CREATE OR REPLACE FUNCTION public.resolve_place(p_text text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  SELECT COALESCE(
    (SELECT min(p.psgc_code) FROM public.places p
      WHERE p.is_active AND p.exact_name = public.normalize_place_name_exact(p_text)
     HAVING count(*) = 1),
    (SELECT min(a.psgc_code) FROM public.place_aliases a
      WHERE a.alias = public.normalize_place_name(p_text)
     HAVING count(*) = 1),
    (SELECT min(p.psgc_code) FROM public.places p
      WHERE p.is_active AND p.search_name = public.normalize_place_name(p_text)
     HAVING count(*) = 1))
$function$;

CREATE OR REPLACE FUNCTION public.search_places(p_query text, p_limit integer DEFAULT 10)
 RETURNS TABLE(code text, label text, kind public.place_kind, score real)
 LANGUAGE sql
 STABLE
AS $function$
  WITH q AS (SELECT public.normalize_place_name(p_query)       AS n,
                    public.normalize_place_name_exact(p_query) AS x),
  hits AS (
    SELECT a.psgc_code AS pcode, 3.0::real AS bonus
      FROM public.place_aliases a, q
     WHERE q.n <> '' AND a.alias = q.n
    UNION ALL
    SELECT p.psgc_code, 0.0::real
      FROM public.places p, q
     WHERE q.n <> '' AND (p.search_name LIKE q.n || '%' OR p.search_name % q.n)
  ),
  best AS (SELECT h.pcode, max(h.bonus) AS bonus FROM hits h GROUP BY h.pcode)
  SELECT p.psgc_code,
         p.name || ', ' || COALESCE(pr.name, rg.name),
         p.kind,
         (b.bonus
          + CASE WHEN p.exact_name = q.x THEN 3.0      -- typed the full official name
                 WHEN p.search_name = q.n THEN 2.0
                 WHEN p.search_name LIKE q.n || '%' THEN 1.0
                 ELSE 0.0 END
          + similarity(p.search_name, q.n))::real
    FROM best b
    JOIN public.places p   ON p.psgc_code = b.pcode
    JOIN public.regions rg ON rg.psgc_code = p.region_code
    LEFT JOIN public.provinces pr ON pr.psgc_code = p.province_code
    CROSS JOIN q
   WHERE p.is_active
   ORDER BY 4 DESC, p.population DESC NULLS LAST, p.name
   LIMIT p_limit
$function$;

CREATE OR REPLACE FUNCTION public.sweep_match_candidates()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.match_candidates mc
   USING public.trips t
   WHERE t.trip_id = mc.trip_id
     AND t.depart_date < public.match_today();
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  DELETE FROM public.match_candidates
   WHERE (consumed_at IS NOT NULL
          OR buyer_dismissed_at IS NOT NULL
          OR traveler_dismissed_at IS NOT NULL)
     AND updated_at < now() - interval '90 days';

  RETURN v_deleted;
END $function$;

