-- Table: public.places

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.places (
    psgc_code text NOT NULL,
    name text NOT NULL,
    kind public.place_kind NOT NULL,
    region_code text NOT NULL,
    province_code text,
    lat numeric(9,6) NOT NULL,
    lng numeric(9,6) NOT NULL,
    population integer,
    search_name text NOT NULL,
    exact_name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_places_code CHECK ((psgc_code ~ '^[0-9]{10}$'::text)),
    CONSTRAINT chk_places_lat CHECK (((lat >= (4)::numeric) AND (lat <= (22)::numeric))),
    CONSTRAINT chk_places_lng CHECK (((lng >= (114)::numeric) AND (lng <= (128)::numeric)))
);
ALTER TABLE ONLY public.places ALTER COLUMN psgc_code SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN name SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN kind SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN region_code SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN province_code SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN lat SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN lng SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN population SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN search_name SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN exact_name SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN is_active SET (pg_attver=61110016);
ALTER TABLE ONLY public.places ALTER COLUMN updated_at SET (pg_attver=61110016);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.places ADD CONSTRAINT places_pkey PRIMARY KEY (psgc_code);
ALTER TABLE ONLY public.places ADD CONSTRAINT fk_place_province FOREIGN KEY (province_code) REFERENCES public.provinces(psgc_code);
ALTER TABLE ONLY public.places ADD CONSTRAINT fk_place_region FOREIGN KEY (region_code) REFERENCES public.regions(psgc_code);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_places_exact_name ON public.places USING btree (exact_name);
CREATE INDEX idx_places_province ON public.places USING btree (province_code);
CREATE INDEX idx_places_region ON public.places USING btree (region_code);
CREATE INDEX idx_places_search_prefix ON public.places USING btree (search_name text_pattern_ops);
CREATE INDEX idx_places_search_trgm ON public.places USING gin (search_name public.gin_trgm_ops);

