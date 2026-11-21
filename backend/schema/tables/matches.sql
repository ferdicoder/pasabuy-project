-- A match is a proposal between one request and one trip.
-- Depends on: user, trips, requests.
BEGIN;

CREATE TYPE public.match_status AS ENUM
  ('proposed', 'accepted', 'rejected', 'withdrawn', 'expired');

CREATE TABLE public.matches (
    match_id      uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    request_id    uuid NOT NULL,
    trip_id       uuid NOT NULL,
    proposed_by   text NOT NULL,
    proposed_fee  numeric(12,2),
    note          text,
    status        public.match_status NOT NULL DEFAULT 'proposed',
    responded_at  timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT matches_pkey         PRIMARY KEY (match_id),
    CONSTRAINT uq_match_pair        UNIQUE (request_id, trip_id),
    CONSTRAINT fk_match_request     FOREIGN KEY (request_id)
        REFERENCES public.requests(request_id) ON DELETE RESTRICT,
    CONSTRAINT fk_match_trip        FOREIGN KEY (trip_id)
        REFERENCES public.trips(trip_id) ON DELETE RESTRICT,
    CONSTRAINT fk_match_proposed_by FOREIGN KEY (proposed_by)
        REFERENCES public."user"(id),
    CONSTRAINT chk_match_fee        CHECK (proposed_fee IS NULL OR proposed_fee >= 0)
);

-- Only the request's buyer or the trip's traveler may propose, never to
-- themselves, and only for an active request / open trip.
CREATE OR REPLACE FUNCTION public.fn_matches_before_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_buyer        text;
  v_req_status   text;
  v_traveler     text;
  v_trip_status  text;
BEGIN
  SELECT buyer_id, status::text
    INTO v_buyer, v_req_status
    FROM public.requests WHERE request_id = NEW.request_id;

  SELECT user_id, status::text
    INTO v_traveler, v_trip_status
    FROM public.trips WHERE trip_id = NEW.trip_id;

  IF v_buyer = v_traveler THEN
    RAISE EXCEPTION 'A user cannot match their own request with their own trip';
  END IF;

  IF NEW.proposed_by NOT IN (v_buyer, v_traveler) THEN
    RAISE EXCEPTION 'proposed_by must be the request buyer or the trip traveler';
  END IF;

  IF v_req_status <> 'active' OR v_trip_status <> 'open' THEN
    RAISE EXCEPTION 'Request must be active and trip must be open to propose a match';
  END IF;

  RETURN NEW;
END $$;

CREATE TRIGGER trg_matches_before_insert
  BEFORE INSERT ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.fn_matches_before_insert();

-- Indexes ((request_id, trip_id) is already covered by uq_match_pair)
-- At most one accepted match per request.
CREATE UNIQUE INDEX uq_matches_one_accepted_per_request
  ON public.matches (request_id)
  WHERE status = 'accepted';
CREATE INDEX idx_matches_trip_id
  ON public.matches (trip_id);
CREATE INDEX idx_matches_proposed_by
  ON public.matches (proposed_by);
CREATE INDEX idx_matches_pending
  ON public.matches (request_id, created_at DESC)
  WHERE status = 'proposed';

COMMIT;