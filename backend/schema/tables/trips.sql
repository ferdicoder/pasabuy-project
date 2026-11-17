--
-- PostgreSQL database dump
--


-- Dumped from database version 18.7 (a21afb5)
-- Dumped by pg_dump version 18.6




--
-- Name: trips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trips (
    trip_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    current_location character varying NOT NULL,
    destination character varying,
    depart_date date NOT NULL,
    arrival_date date NOT NULL,
    capacity_kg integer NOT NULL,
    status character varying(255) DEFAULT 'open'::character varying NOT NULL,
    image_url character varying,
    user_id text
);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: trips fk_user_trip; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT fk_user_trip FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--


