-- Table: public.messages

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.messages (
    message_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    match_id uuid NOT NULL,
    sender_id text NOT NULL,
    body text,
    image_url character varying,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_message_content CHECK (((body IS NOT NULL) OR (image_url IS NOT NULL)))
);
ALTER TABLE ONLY public.messages ALTER COLUMN message_id SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN match_id SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN sender_id SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN body SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN image_url SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN read_at SET (pg_attver=59832968);
ALTER TABLE ONLY public.messages ALTER COLUMN created_at SET (pg_attver=59832968);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.messages ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);
ALTER TABLE ONLY public.messages ADD CONSTRAINT fk_message_match FOREIGN KEY (match_id) REFERENCES public.matches(match_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.messages ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_messages_match_timeline ON public.messages USING btree (match_id, created_at);
CREATE INDEX idx_messages_unread ON public.messages USING btree (match_id, sender_id) WHERE (read_at IS NULL);

