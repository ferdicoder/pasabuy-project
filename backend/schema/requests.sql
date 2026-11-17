--
-- PostgreSQL database dump
--

\restrict sFIddRw13J7Af33GVqyEvxbsGj4Nz1GsRaveGKNBvYKQz5Yfyp2lGmnLRynYLPz

-- Dumped from database version 18.7 (a21afb5)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

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

\unrestrict sFIddRw13J7Af33GVqyEvxbsGj4Nz1GsRaveGKNBvYKQz5Yfyp2lGmnLRynYLPz

