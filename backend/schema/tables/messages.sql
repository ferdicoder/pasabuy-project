-- 07_messages.sql
-- Chat belongs to the match, so it works before and after acceptance.
-- Depends on: user, matches.
BEGIN;

CREATE TABLE public.messages (
    message_id  uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    match_id    uuid NOT NULL,
    sender_id   text NOT NULL,
    body        text,
    image_url   character varying,
    read_at     timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT messages_pkey       PRIMARY KEY (message_id),
    CONSTRAINT fk_message_match    FOREIGN KEY (match_id)
        REFERENCES public.matches(match_id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender   FOREIGN KEY (sender_id)
        REFERENCES public."user"(id),
    CONSTRAINT chk_message_content CHECK (body IS NOT NULL OR image_url IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_messages_match_timeline
  ON public.messages (match_id, created_at);
CREATE INDEX idx_messages_unread
  ON public.messages (match_id, sender_id)
  WHERE read_at IS NULL;

COMMIT;