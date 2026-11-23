-- Table: public.place_aliases

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.place_aliases (
    alias text NOT NULL,
    psgc_code text NOT NULL
);
ALTER TABLE ONLY public.place_aliases ALTER COLUMN alias SET (pg_attver=61163992);
ALTER TABLE ONLY public.place_aliases ALTER COLUMN psgc_code SET (pg_attver=61163992);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.place_aliases ADD CONSTRAINT place_aliases_pkey PRIMARY KEY (alias, psgc_code);
ALTER TABLE ONLY public.place_aliases ADD CONSTRAINT fk_alias_place FOREIGN KEY (psgc_code) REFERENCES public.places(psgc_code) ON DELETE CASCADE;

