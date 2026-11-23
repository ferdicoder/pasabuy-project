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
    from_place_code text,
    to_place_code text,
    CONSTRAINT chk_trips_capacity_positive CHECK ((capacity_kg > 0)),
    CONSTRAINT chk_trips_dates CHECK ((arrival_date >= depart_date)),
    CONSTRAINT chk_trips_reserved CHECK (((reserved_kg >= (0)::numeric) AND (reserved_kg <= (capacity_kg)::numeric)))
);
ALTER TABLE ONLY public.trips ALTER COLUMN status SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN image_url SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN user_id SET (pg_attver=59569960);
ALTER TABLE ONLY public.trips ALTER COLUMN reserved_kg SET (pg_attver=59592256);
ALTER TABLE ONLY public.trips ALTER COLUMN from_place_code SET (pg_attver=61227048);
ALTER TABLE ONLY public.trips ALTER COLUMN to_place_code SET (pg_attver=61227920);

-- ---------------------------------------------------------------------
-- Constraints
-- ---------------------------------------------------------------------
ALTER TABLE ONLY public.trips ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);
ALTER TABLE ONLY public.trips ADD CONSTRAINT fk_trips_from_place FOREIGN KEY (from_place_code) REFERENCES public.places(psgc_code);
ALTER TABLE ONLY public.trips ADD CONSTRAINT fk_trips_to_place FOREIGN KEY (to_place_code) REFERENCES public.places(psgc_code);
ALTER TABLE ONLY public.trips ADD CONSTRAINT fk_user_trip FOREIGN KEY (user_id) REFERENCES public."user"(id);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_trips_open_by_date ON public.trips USING btree (depart_date) WHERE (status = 'open'::public.trip_status);
CREATE INDEX idx_trips_open_route ON public.trips USING btree (from_place_code, to_place_code, depart_date) WHERE (status = 'open'::public.trip_status);
CREATE INDEX idx_trips_user_id ON public.trips USING btree (user_id);

-- ---------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_trips_enqueue_match()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.match_outbox (entity_type, entity_id)
  VALUES ('trip', NEW.trip_id);
  PERFORM pg_notify('match_outbox', '');
  RETURN NULL;
END $function$;

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_trips_enqueue_match_ins AFTER INSERT ON public.trips FOR EACH ROW EXECUTE FUNCTION public.fn_trips_enqueue_match();
CREATE TRIGGER trg_trips_enqueue_match_upd AFTER UPDATE OF status, from_place_code, to_place_code, depart_date, arrival_date, capacity_kg, reserved_kg ON public.trips FOR EACH ROW WHEN (old.status IS DISTINCT FROM new.status OR old.from_place_code IS DISTINCT FROM new.from_place_code OR old.to_place_code IS DISTINCT FROM new.to_place_code OR old.depart_date IS DISTINCT FROM new.depart_date OR old.arrival_date IS DISTINCT FROM new.arrival_date OR old.capacity_kg IS DISTINCT FROM new.capacity_kg OR old.reserved_kg IS DISTINCT FROM new.reserved_kg) EXECUTE FUNCTION public.fn_trips_enqueue_match();

