-- Table: public.requests

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.requests (
    request_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    title text NOT NULL,
    description text,
    estimated_price numeric NOT NULL,
    origin character varying NOT NULL,
    delivery_location character varying,
    status public.request_status DEFAULT 'active'::public.request_status NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    image_url character varying,
    buyer_id text NOT NULL,
    weight_kg numeric(6,2) NOT NULL,
    currency character(3) DEFAULT 'PHP'::bpchar NOT NULL,
    from_place_code text,
    to_place_code text,
    CONSTRAINT chk_requests_price CHECK ((estimated_price >= (0)::numeric)),
    CONSTRAINT chk_requests_weight CHECK ((weight_kg > (0)::numeric))
);
ALTER TABLE ONLY public.requests ALTER COLUMN weight_kg SET (pg_attver=59617488);
ALTER TABLE ONLY public.requests ALTER COLUMN currency SET (pg_attver=59619096);
ALTER TABLE ONLY public.requests ALTER COLUMN from_place_code SET (pg_attver=61217984);
ALTER TABLE ONLY public.requests ALTER COLUMN to_place_code SET (pg_attver=61218440);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.requests ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);
ALTER TABLE ONLY public.requests ADD CONSTRAINT fk_requests_from_place FOREIGN KEY (from_place_code) REFERENCES public.places(psgc_code);
ALTER TABLE ONLY public.requests ADD CONSTRAINT fk_requests_to_place FOREIGN KEY (to_place_code) REFERENCES public.places(psgc_code);
ALTER TABLE ONLY public.requests ADD CONSTRAINT fk_user_request FOREIGN KEY (buyer_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_requests_active_by_created ON public.requests USING btree (created_at DESC) WHERE (status = 'active'::public.request_status);
CREATE INDEX idx_requests_active_route ON public.requests USING btree (from_place_code, to_place_code) WHERE (status = 'active'::public.request_status);
CREATE INDEX idx_requests_buyer_id ON public.requests USING btree (buyer_id);

-- ---------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_requests_enqueue_match()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.match_outbox (entity_type, entity_id)
  VALUES ('request', NEW.request_id);
  PERFORM pg_notify('match_outbox', '');
  RETURN NULL;
END $function$;

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_requests_enqueue_match_ins AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION public.fn_requests_enqueue_match();
CREATE TRIGGER trg_requests_enqueue_match_upd AFTER UPDATE OF status, from_place_code, to_place_code, weight_kg ON public.requests FOR EACH ROW WHEN (old.status IS DISTINCT FROM new.status OR old.from_place_code IS DISTINCT FROM new.from_place_code OR old.to_place_code IS DISTINCT FROM new.to_place_code OR old.weight_kg IS DISTINCT FROM new.weight_kg) EXECUTE FUNCTION public.fn_requests_enqueue_match();

