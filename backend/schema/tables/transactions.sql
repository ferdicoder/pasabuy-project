-- A transaction exists only for an accepted match (strict 1:1).
-- Depends on: user, trips, requests, matches.
-- NOTE: the trigger functions below write to transaction_events (06). That is
-- fine at creation time (plpgsql resolves tables at run time), but the table
-- must exist before the first INSERT/UPDATE on transactions.
BEGIN;

CREATE TYPE public.transaction_status AS ENUM
  ('awaiting_purchase', 'purchased', 'in_transit',
   'delivered', 'completed', 'cancelled', 'disputed');

CREATE TABLE public.transactions (
    transaction_id  uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    match_id        uuid NOT NULL,
    buyer_id        text NOT NULL,
    traveler_id     text NOT NULL,
    status          public.transaction_status NOT NULL DEFAULT 'awaiting_purchase',

    weight_kg       numeric(6,2) NOT NULL,
    currency        char(3) NOT NULL DEFAULT 'PHP',
    item_price      numeric(12,2) NOT NULL,
    service_fee     numeric(12,2) NOT NULL,
    delivery_fee    numeric(12,2) NOT NULL DEFAULT 0,
    total_price     numeric(12,2) GENERATED ALWAYS AS
                    (item_price + service_fee + delivery_fee) STORED,

    purchased_at    timestamptz,
    delivered_at    timestamptz,
    completed_at    timestamptz,
    cancelled_at    timestamptz,
    cancelled_by    text,
    cancel_reason   text,

    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT transactions_pkey    PRIMARY KEY (transaction_id),
    CONSTRAINT uq_transaction_match UNIQUE (match_id),
    CONSTRAINT fk_txn_match         FOREIGN KEY (match_id)
        REFERENCES public.matches(match_id) ON DELETE RESTRICT,
    CONSTRAINT fk_txn_buyer         FOREIGN KEY (buyer_id)
        REFERENCES public."user"(id),
    CONSTRAINT fk_txn_traveler      FOREIGN KEY (traveler_id)
        REFERENCES public."user"(id),
    CONSTRAINT fk_txn_cancelled_by  FOREIGN KEY (cancelled_by)
        REFERENCES public."user"(id),
    CONSTRAINT chk_txn_parties      CHECK (buyer_id <> traveler_id),
    CONSTRAINT chk_txn_weight       CHECK (weight_kg > 0),
    CONSTRAINT chk_txn_money        CHECK (item_price >= 0
                                       AND service_fee >= 0
                                       AND delivery_fee >= 0)
);

-- BEFORE INSERT: match must be accepted; parties must really be the
-- request's buyer and the trip's traveler.
CREATE OR REPLACE FUNCTION public.fn_transactions_before_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_match_status text;
  v_buyer        text;
  v_traveler     text;
BEGIN
  SELECT m.status::text, r.buyer_id, t.user_id
    INTO v_match_status, v_buyer, v_traveler
    FROM public.matches m
    JOIN public.requests r ON r.request_id = m.request_id
    JOIN public.trips    t ON t.trip_id    = m.trip_id
   WHERE m.match_id = NEW.match_id;

  IF v_match_status IS DISTINCT FROM 'accepted' THEN
    RAISE EXCEPTION 'A transaction can only be created from an accepted match';
  END IF;

  IF NEW.buyer_id <> v_buyer OR NEW.traveler_id <> v_traveler THEN
    RAISE EXCEPTION 'Transaction parties must match the request buyer and trip traveler';
  END IF;

  RETURN NEW;
END $$;

CREATE TRIGGER trg_transactions_before_insert
  BEFORE INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_before_insert();

-- BEFORE UPDATE: enforce the status machine, stamp lifecycle timestamps,
-- maintain updated_at.
CREATE OR REPLACE FUNCTION public.fn_transactions_before_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (
         (OLD.status = 'awaiting_purchase' AND NEW.status IN ('purchased', 'cancelled'))
      OR (OLD.status = 'purchased'         AND NEW.status IN ('in_transit', 'cancelled', 'disputed'))
      OR (OLD.status = 'in_transit'        AND NEW.status IN ('delivered', 'disputed'))
      OR (OLD.status = 'delivered'         AND NEW.status IN ('completed', 'disputed'))
      OR (OLD.status = 'disputed'          AND NEW.status IN ('completed', 'cancelled'))
    ) THEN
      RAISE EXCEPTION 'Invalid transaction status transition: % -> %',
        OLD.status, NEW.status;
    END IF;

    IF NEW.status = 'purchased' THEN
      NEW.purchased_at := COALESCE(NEW.purchased_at, now());
    ELSIF NEW.status = 'delivered' THEN
      NEW.delivered_at := COALESCE(NEW.delivered_at, now());
    ELSIF NEW.status = 'completed' THEN
      NEW.completed_at := COALESCE(NEW.completed_at, now());
    ELSIF NEW.status = 'cancelled' THEN
      NEW.cancelled_at := COALESCE(NEW.cancelled_at, now());
    END IF;
  END IF;

  RETURN NEW;
END $$;

CREATE TRIGGER trg_transactions_before_update
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_before_update();

-- AFTER INSERT: reserve trip capacity + first audit event.
-- The UPDATE locks the trip row, and chk_trips_reserved rejects overbooking,
-- so two simultaneous accepts cannot both succeed.
-- Optional: run  SELECT set_config('app.current_user_id', $1, true)  at the
-- start of the DB transaction so events record who acted.
CREATE OR REPLACE FUNCTION public.fn_transactions_after_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.trips t
     SET reserved_kg = t.reserved_kg + NEW.weight_kg
    FROM public.matches m
   WHERE m.match_id = NEW.match_id
     AND t.trip_id  = m.trip_id;

  INSERT INTO public.transaction_events (transaction_id, from_status, to_status, actor_id)
  VALUES (NEW.transaction_id, NULL, NEW.status,
          NULLIF(current_setting('app.current_user_id', true), ''));

  RETURN NEW;
END $$;

CREATE TRIGGER trg_transactions_after_insert
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_after_insert();

-- AFTER status change: release capacity on cancel + audit event.
CREATE OR REPLACE FUNCTION public.fn_transactions_after_status_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'cancelled' THEN
    UPDATE public.trips t
       SET reserved_kg = t.reserved_kg - NEW.weight_kg
      FROM public.matches m
     WHERE m.match_id = NEW.match_id
       AND t.trip_id  = m.trip_id;
  END IF;

  INSERT INTO public.transaction_events
         (transaction_id, from_status, to_status, actor_id, note)
  VALUES (NEW.transaction_id, OLD.status, NEW.status,
          NULLIF(current_setting('app.current_user_id', true), ''),
          CASE WHEN NEW.status = 'cancelled' THEN NEW.cancel_reason END);

  RETURN NEW;
END $$;

CREATE TRIGGER trg_transactions_after_status_change
  AFTER UPDATE OF status ON public.transactions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.fn_transactions_after_status_change();

-- Indexes (match_id is covered by uq_transaction_match)
CREATE INDEX idx_txn_buyer_history
  ON public.transactions (buyer_id, created_at DESC);
CREATE INDEX idx_txn_traveler_history
  ON public.transactions (traveler_id, created_at DESC);
CREATE INDEX idx_txn_active
  ON public.transactions (status, updated_at DESC)
  WHERE status NOT IN ('completed', 'cancelled');

COMMIT;