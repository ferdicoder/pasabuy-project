-- Table: public.match_outbox

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.match_outbox (
    outbox_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    enqueued_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_outbox_entity_type CHECK ((entity_type = ANY (ARRAY['request'::text, 'trip'::text])))
);
ALTER TABLE ONLY public.match_outbox ALTER COLUMN outbox_id SET (pg_attver=60789376);
ALTER TABLE ONLY public.match_outbox ALTER COLUMN entity_type SET (pg_attver=60789376);
ALTER TABLE ONLY public.match_outbox ALTER COLUMN entity_id SET (pg_attver=60789376);
ALTER TABLE ONLY public.match_outbox ALTER COLUMN enqueued_at SET (pg_attver=60789376);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.match_outbox ADD CONSTRAINT match_outbox_pkey PRIMARY KEY (outbox_id);

