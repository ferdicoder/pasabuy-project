-- Table: public.match_score_config

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.match_score_config (
    version smallint NOT NULL,
    w_fit numeric NOT NULL,
    w_timing numeric NOT NULL,
    w_age numeric NOT NULL,
    timing_halflife_days numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    w_locality numeric DEFAULT 0 NOT NULL,
    max_match_km numeric DEFAULT 30 NOT NULL,
    CONSTRAINT chk_halflife CHECK ((timing_halflife_days > (0)::numeric)),
    CONSTRAINT chk_max_match_km CHECK (((max_match_km > (0)::numeric) AND (max_match_km <= (60)::numeric))),
    CONSTRAINT chk_weights_nonneg CHECK (((w_fit >= (0)::numeric) AND (w_timing >= (0)::numeric) AND (w_age >= (0)::numeric) AND (w_locality >= (0)::numeric))),
    CONSTRAINT chk_weights_sum CHECK (((((w_fit + w_timing) + w_age) + w_locality) = (1)::numeric))
);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN version SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN w_fit SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN w_timing SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN w_age SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN timing_halflife_days SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN created_at SET (pg_attver=60833040);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN w_locality SET (pg_attver=61257840);
ALTER TABLE ONLY public.match_score_config ALTER COLUMN max_match_km SET (pg_attver=61259296);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.match_score_config ADD CONSTRAINT match_score_config_pkey PRIMARY KEY (version);

