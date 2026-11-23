-- Table: public.match_candidates

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.match_candidates (
    candidate_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    request_id uuid NOT NULL,
    trip_id uuid NOT NULL,
    score numeric(6,5) NOT NULL,
    score_parts jsonb NOT NULL,
    score_version smallint NOT NULL,
    notified_buyer_at timestamp with time zone,
    notified_traveler_at timestamp with time zone,
    buyer_dismissed_at timestamp with time zone,
    traveler_dismissed_at timestamp with time zone,
    consumed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_candidate_score CHECK (((score >= (0)::numeric) AND (score <= (1)::numeric)))
);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN candidate_id SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN request_id SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN trip_id SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN score SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN score_parts SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN score_version SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN notified_buyer_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN notified_traveler_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN buyer_dismissed_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN traveler_dismissed_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN consumed_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN created_at SET (pg_attver=60882176);
ALTER TABLE ONLY public.match_candidates ALTER COLUMN updated_at SET (pg_attver=60882176);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.match_candidates ADD CONSTRAINT match_candidates_pkey PRIMARY KEY (candidate_id);
ALTER TABLE ONLY public.match_candidates ADD CONSTRAINT uq_candidate_pair UNIQUE (request_id, trip_id);
ALTER TABLE ONLY public.match_candidates ADD CONSTRAINT fk_candidate_request FOREIGN KEY (request_id) REFERENCES public.requests(request_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.match_candidates ADD CONSTRAINT fk_candidate_trip FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_candidates_notify_buyer ON public.match_candidates USING btree (created_at) WHERE ((notified_buyer_at IS NULL) AND (consumed_at IS NULL));
CREATE INDEX idx_candidates_notify_traveler ON public.match_candidates USING btree (created_at) WHERE ((notified_traveler_at IS NULL) AND (consumed_at IS NULL));
CREATE INDEX idx_candidates_request_feed ON public.match_candidates USING btree (request_id, score DESC, candidate_id DESC) WHERE ((consumed_at IS NULL) AND (buyer_dismissed_at IS NULL));
CREATE INDEX idx_candidates_score_version ON public.match_candidates USING btree (score_version);
CREATE INDEX idx_candidates_trip_feed ON public.match_candidates USING btree (trip_id, score DESC, candidate_id DESC) WHERE ((consumed_at IS NULL) AND (traveler_dismissed_at IS NULL));

