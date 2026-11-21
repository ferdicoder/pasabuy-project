-- Table: public.transaction_events

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.transaction_events (
    event_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    transaction_id uuid NOT NULL,
    from_status public.transaction_status,
    to_status public.transaction_status NOT NULL,
    actor_id text,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN event_id SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN transaction_id SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN from_status SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN to_status SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN actor_id SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN note SET (pg_attver=59796128);
ALTER TABLE ONLY public.transaction_events ALTER COLUMN created_at SET (pg_attver=59796128);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.transaction_events ADD CONSTRAINT transaction_events_pkey PRIMARY KEY (event_id);
ALTER TABLE ONLY public.transaction_events ADD CONSTRAINT fk_event_actor FOREIGN KEY (actor_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.transaction_events ADD CONSTRAINT fk_event_txn FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id) ON DELETE RESTRICT;

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_events_txn_timeline ON public.transaction_events USING btree (transaction_id, created_at);

