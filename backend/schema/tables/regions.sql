-- Table: public.regions

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.regions (
    psgc_code text NOT NULL,
    name text NOT NULL,
    island_group text,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_regions_code CHECK ((psgc_code ~ '^[0-9]{10}$'::text))
);
ALTER TABLE ONLY public.regions ALTER COLUMN psgc_code SET (pg_attver=61056368);
ALTER TABLE ONLY public.regions ALTER COLUMN name SET (pg_attver=61056368);
ALTER TABLE ONLY public.regions ALTER COLUMN island_group SET (pg_attver=61056368);
ALTER TABLE ONLY public.regions ALTER COLUMN is_active SET (pg_attver=61056368);
ALTER TABLE ONLY public.regions ALTER COLUMN updated_at SET (pg_attver=61056368);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.regions ADD CONSTRAINT regions_pkey PRIMARY KEY (psgc_code);

