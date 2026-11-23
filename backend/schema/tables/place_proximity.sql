-- Table: public.place_proximity

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.place_proximity (
    place_code text NOT NULL,
    near_code text NOT NULL,
    distance_km numeric(7,2) NOT NULL,
    CONSTRAINT chk_prox_distance CHECK ((distance_km >= (0)::numeric))
);
ALTER TABLE ONLY public.place_proximity ALTER COLUMN place_code SET (pg_attver=61189128);
ALTER TABLE ONLY public.place_proximity ALTER COLUMN near_code SET (pg_attver=61189128);
ALTER TABLE ONLY public.place_proximity ALTER COLUMN distance_km SET (pg_attver=61189128);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.place_proximity ADD CONSTRAINT place_proximity_pkey PRIMARY KEY (place_code, near_code);
ALTER TABLE ONLY public.place_proximity ADD CONSTRAINT fk_prox_near FOREIGN KEY (near_code) REFERENCES public.places(psgc_code) ON DELETE CASCADE;
ALTER TABLE ONLY public.place_proximity ADD CONSTRAINT fk_prox_place FOREIGN KEY (place_code) REFERENCES public.places(psgc_code) ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_proximity_near ON public.place_proximity USING btree (near_code, place_code);

