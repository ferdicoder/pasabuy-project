-- Table: public.matches

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.matches (
    match_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    request_id uuid NOT NULL,
    trip_id uuid NOT NULL,
    proposed_by text NOT NULL,
    proposed_fee numeric(12,2),
    note text,
    status public.match_status DEFAULT 'proposed'::public.match_status NOT NULL,
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_match_fee CHECK (((proposed_fee IS NULL) OR (proposed_fee >= (0)::numeric)))
);
ALTER TABLE ONLY public.matches ALTER COLUMN match_id SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN request_id SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN trip_id SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN proposed_by SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN proposed_fee SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN note SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN status SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN responded_at SET (pg_attver=59641960);
ALTER TABLE ONLY public.matches ALTER COLUMN created_at SET (pg_attver=59641960);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.matches ADD CONSTRAINT matches_pkey PRIMARY KEY (match_id);
ALTER TABLE ONLY public.matches ADD CONSTRAINT uq_match_pair UNIQUE (request_id, trip_id);
ALTER TABLE ONLY public.matches ADD CONSTRAINT fk_match_proposed_by FOREIGN KEY (proposed_by) REFERENCES public."user"(id);
ALTER TABLE ONLY public.matches ADD CONSTRAINT fk_match_request FOREIGN KEY (request_id) REFERENCES public.requests(request_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.matches ADD CONSTRAINT fk_match_trip FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE RESTRICT;

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_matches_pending ON public.matches USING btree (request_id, created_at DESC) WHERE (status = 'proposed'::public.match_status);
CREATE INDEX idx_matches_proposed_by ON public.matches USING btree (proposed_by);
CREATE INDEX idx_matches_trip_id ON public.matches USING btree (trip_id);
CREATE UNIQUE INDEX uq_matches_one_accepted_per_request ON public.matches USING btree (request_id) WHERE (status = 'accepted'::public.match_status);

-- ---------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_matches_before_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
END $function$;

CREATE OR REPLACE FUNCTION public.fn_matches_consume_candidate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.match_candidates
     SET consumed_at = now(), updated_at = now()
   WHERE request_id = NEW.request_id
     AND trip_id    = NEW.trip_id
     AND consumed_at IS NULL;
  RETURN NULL;
END $function$;

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_matches_before_insert BEFORE INSERT ON public.matches FOR EACH ROW EXECUTE FUNCTION public.fn_matches_before_insert();
CREATE TRIGGER trg_matches_consume_candidate AFTER INSERT ON public.matches FOR EACH ROW EXECUTE FUNCTION public.fn_matches_consume_candidate();

