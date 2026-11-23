-- Table: public.provinces

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.provinces (
    psgc_code text NOT NULL,
    name text NOT NULL,
    region_code text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_provinces_code CHECK ((psgc_code ~ '^[0-9]{10}$'::text))
);
ALTER TABLE ONLY public.provinces ALTER COLUMN psgc_code SET (pg_attver=61080992);
ALTER TABLE ONLY public.provinces ALTER COLUMN name SET (pg_attver=61080992);
ALTER TABLE ONLY public.provinces ALTER COLUMN region_code SET (pg_attver=61080992);
ALTER TABLE ONLY public.provinces ALTER COLUMN is_active SET (pg_attver=61080992);
ALTER TABLE ONLY public.provinces ALTER COLUMN updated_at SET (pg_attver=61080992);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.provinces ADD CONSTRAINT provinces_pkey PRIMARY KEY (psgc_code);
ALTER TABLE ONLY public.provinces ADD CONSTRAINT fk_province_region FOREIGN KEY (region_code) REFERENCES public.regions(psgc_code);

