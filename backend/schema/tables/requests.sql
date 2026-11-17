--
-- PostgreSQL database dump
--


-- Dumped from database version 18.7 (a21afb5)
-- Dumped by pg_dump version 18.6




--
-- Name: requests; Type: TABLE; Schema: public; Owner: -
--

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
    buyer_id text
);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);


--
-- Name: requests fk_user_request; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT fk_user_request FOREIGN KEY (buyer_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--


