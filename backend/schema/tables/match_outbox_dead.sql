-- Table: public.match_outbox_dead

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.match_outbox_dead (
    dead_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    error text NOT NULL,
    failed_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.match_outbox_dead ALTER COLUMN dead_id SET (pg_attver=60809944);
ALTER TABLE ONLY public.match_outbox_dead ALTER COLUMN entity_type SET (pg_attver=60809944);
ALTER TABLE ONLY public.match_outbox_dead ALTER COLUMN entity_id SET (pg_attver=60809944);
ALTER TABLE ONLY public.match_outbox_dead ALTER COLUMN error SET (pg_attver=60809944);
ALTER TABLE ONLY public.match_outbox_dead ALTER COLUMN failed_at SET (pg_attver=60809944);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.match_outbox_dead ADD CONSTRAINT match_outbox_dead_pkey PRIMARY KEY (dead_id);

