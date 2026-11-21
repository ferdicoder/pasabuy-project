-- Append-only status timeline. Rows are written by the triggers in
-- 05_transactions.sql; the app should only read from it.
-- Depends on: user, transactions.
BEGIN;

CREATE TABLE public.transaction_events (
    event_id        uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    transaction_id  uuid NOT NULL,
    from_status     public.transaction_status,
    to_status       public.transaction_status NOT NULL,
    actor_id        text,
    note            text,
    created_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT transaction_events_pkey PRIMARY KEY (event_id),
    CONSTRAINT fk_event_txn            FOREIGN KEY (transaction_id)
        REFERENCES public.transactions(transaction_id) ON DELETE RESTRICT,
    CONSTRAINT fk_event_actor          FOREIGN KEY (actor_id)
        REFERENCES public."user"(id)
);

-- Indexes
CREATE INDEX idx_events_txn_timeline
  ON public.transaction_events (transaction_id, created_at);

COMMIT;