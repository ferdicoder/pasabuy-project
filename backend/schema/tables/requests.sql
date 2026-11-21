-- 03_requests.sql
-- Existing table + changes: weight_kg, currency, NOT NULL buyer, checks, indexes.
-- Part 2 (ALTERs) is NOT re-runnable.
-- Existing rows get weight 1.00 kg as a PLACEHOLDER; update real values later.
BEGIN;

-- ASSUMPTION: your real request_status enum already exists and this is skipped.
-- The values below are only used on a fresh database. Adjust them to yours.
DO $$
BEGIN
  CREATE TYPE public.request_status AS ENUM
    ('active', 'matched', 'fulfilled', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Part 1: existing table (as provided)
CREATE TABLE IF NOT EXISTS public.requests (
    request_id         uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    title              text NOT NULL,
    description        text,
    estimated_price    numeric NOT NULL,
    origin             character varying NOT NULL,
    delivery_location  character varying,
    status             public.request_status DEFAULT 'active'::public.request_status NOT NULL,
    created_at         timestamp with time zone DEFAULT now(),
    image_url          character varying,
    buyer_id           text,
    CONSTRAINT requests_pkey   PRIMARY KEY (request_id),
    CONSTRAINT fk_user_request FOREIGN KEY (buyer_id) REFERENCES public."user"(id)
);

-- Part 2: changes
ALTER TABLE public.requests
  ALTER COLUMN buyer_id SET NOT NULL,
  ADD COLUMN weight_kg numeric(6,2) NOT NULL DEFAULT 1.00,
  ADD COLUMN currency  char(3)      NOT NULL DEFAULT 'PHP',
  ADD CONSTRAINT chk_requests_price  CHECK (estimated_price >= 0),
  ADD CONSTRAINT chk_requests_weight CHECK (weight_kg > 0);

-- New inserts must state a weight explicitly.
ALTER TABLE public.requests ALTER COLUMN weight_kg DROP DEFAULT;

-- Indexes
CREATE INDEX idx_requests_buyer_id
  ON public.requests (buyer_id);
CREATE INDEX idx_requests_active_by_created
  ON public.requests (created_at DESC)
  WHERE status = 'active';
CREATE INDEX idx_requests_active_route
  ON public.requests (origin, delivery_location)
  WHERE status = 'active';

COMMIT;