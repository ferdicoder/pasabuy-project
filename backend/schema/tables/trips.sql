-- Table: public.trips

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
CREATE TABLE public.trips (
    trip_id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    current_location character varying NOT NULL,
    destination character varying,
    depart_date date NOT NULL,
    arrival_date date NOT NULL,
    capacity_kg integer NOT NULL,
    status public.trip_status DEFAULT 'open'::public.trip_status NOT NULL,
    image_url character varying,
    user_id text NOT NULL,
    reserved_kg numeric(6,2) DEFAULT 0 NOT NULL,
    CONSTRAINT chk_trips_capacity_positive CHECK ((capacity_kg > 0)),
    CONSTRAINT chk_trips_dates CHECK ((arrival_date >= depart_date)),
    CONSTRAINT chk_trips_reserved CHECK (((reserved_kg >= (0)::numeric) AND (reserved_kg <= (capacity_kg)::numeric)))
);
ALTER TABLE ONLY public.trips ALTER COLUMN status SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN image_url SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN user_id SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN reserved_kg SET (pg_attver=59592256);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.trips ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);
ALTER TABLE ONLY public.trips ADD CONSTRAINT fk_user_trip FOREIGN KEY (user_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_trips_open_by_date ON public.trips USING btree (depart_date) WHERE (status = 'open'::public.trip_status);
CREATE INDEX idx_trips_open_route ON public.trips USING btree (current_location, destination, depart_date) WHERE (status = 'open'::public.trip_status);
CREATE INDEX idx_trips_user_id ON public.trips USING btree (user_id);

