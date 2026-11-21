-- Table: public.transactions

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.transactions (
    transaction_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    match_id uuid NOT NULL,
    buyer_id text NOT NULL,
    traveler_id text NOT NULL,
    status public.transaction_status DEFAULT 'awaiting_purchase'::public.transaction_status NOT NULL,
    weight_kg numeric(6,2) NOT NULL,
    currency character(3) DEFAULT 'PHP'::bpchar NOT NULL,
    item_price numeric(12,2) NOT NULL,
    service_fee numeric(12,2) NOT NULL,
    delivery_fee numeric(12,2) DEFAULT 0 NOT NULL,
    total_price numeric(12,2) GENERATED ALWAYS AS (((item_price + service_fee) + delivery_fee)) STORED,
    purchased_at timestamp with time zone,
    delivered_at timestamp with time zone,
    completed_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    cancelled_by text,
    cancel_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_txn_money CHECK (((item_price >= (0)::numeric) AND (service_fee >= (0)::numeric) AND (delivery_fee >= (0)::numeric))),
    CONSTRAINT chk_txn_parties CHECK ((buyer_id <> traveler_id)),
    CONSTRAINT chk_txn_weight CHECK ((weight_kg > (0)::numeric))
);
ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN match_id SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN buyer_id SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN traveler_id SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN status SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN weight_kg SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN currency SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN item_price SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN service_fee SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN delivery_fee SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN total_price SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN purchased_at SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN delivered_at SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN completed_at SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN cancelled_at SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN cancelled_by SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN cancel_reason SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN created_at SET (pg_attver=59703224);
ALTER TABLE ONLY public.transactions ALTER COLUMN updated_at SET (pg_attver=59703224);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.transactions ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT uq_transaction_match UNIQUE (match_id);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT fk_txn_buyer FOREIGN KEY (buyer_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT fk_txn_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES public."user"(id);
ALTER TABLE ONLY public.transactions ADD CONSTRAINT fk_txn_match FOREIGN KEY (match_id) REFERENCES public.matches(match_id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.transactions ADD CONSTRAINT fk_txn_traveler FOREIGN KEY (traveler_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_txn_active ON public.transactions USING btree (status, updated_at DESC) WHERE (status <> ALL (ARRAY['completed'::public.transaction_status, 'cancelled'::public.transaction_status]));
CREATE INDEX idx_txn_buyer_history ON public.transactions USING btree (buyer_id, created_at DESC);
CREATE INDEX idx_txn_traveler_history ON public.transactions USING btree (traveler_id, created_at DESC);

-- ---------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_transactions_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
END $function$;

CREATE OR REPLACE FUNCTION public.fn_transactions_after_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
END $function$;

CREATE OR REPLACE FUNCTION public.fn_transactions_before_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
END $function$;

CREATE OR REPLACE FUNCTION public.fn_transactions_before_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
END $function$;

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_transactions_after_insert AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_after_insert();
CREATE TRIGGER trg_transactions_after_status_change AFTER UPDATE OF status ON public.transactions FOR EACH ROW WHEN (old.status IS DISTINCT FROM new.status) EXECUTE FUNCTION public.fn_transactions_after_status_change();
CREATE TRIGGER trg_transactions_before_insert BEFORE INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_before_insert();
CREATE TRIGGER trg_transactions_before_update BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.fn_transactions_before_update();

