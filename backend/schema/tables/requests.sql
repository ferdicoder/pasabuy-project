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
    CONSTRAINT chk_requests_price CHECK ((estimated_price >= (0)::numeric)),
    CONSTRAINT chk_requests_weight CHECK ((weight_kg > (0)::numeric))
);
ALTER TABLE ONLY public.requests ALTER COLUMN weight_kg SET (pg_attver=59617488);
ALTER TABLE ONLY public.requests ALTER COLUMN currency SET (pg_attver=59619096);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.requests ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);
ALTER TABLE ONLY public.requests ADD CONSTRAINT fk_user_request FOREIGN KEY (buyer_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_requests_active_by_created ON public.requests USING btree (created_at DESC) WHERE (status = 'active'::public.request_status);
CREATE INDEX idx_requests_active_route ON public.requests USING btree (origin, delivery_location) WHERE (status = 'active'::public.request_status);
CREATE INDEX idx_requests_buyer_id ON public.requests USING btree (buyer_id);

