-- 02_trips.sql
-- Existing table + changes: enum status, NOT NULL owner, checks,
-- reserved_kg (capacity tracking), indexes.
-- Part 2 (ALTERs) is NOT re-runnable. It fails if existing rows hold a status
-- outside trip_status, or violate the new NOT NULL / CHECK constraints.
-- Check first:  SELECT DISTINCT status FROM public.trips;
BEGIN;

CREATE TYPE public.trip_status AS ENUM
  ('open', 'full', 'in_transit', 'completed', 'cancelled');

-- Part 1: existing table (as provided)
CREATE TABLE IF NOT EXISTS public.trips (
    trip_id           uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    current_location  character varying NOT NULL,
    destination       character varying,
    depart_date       date NOT NULL,
    arrival_date      date NOT NULL,
    capacity_kg       integer NOT NULL,
    status            character varying(255) DEFAULT 'open'::character varying NOT NULL,
    image_url         character varying,
    user_id           text,
    CONSTRAINT trips_pkey   PRIMARY KEY (trip_id),
    CONSTRAINT fk_user_trip FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

-- Part 2: changes
ALTER TABLE public.trips ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.trips
  ALTER COLUMN status TYPE public.trip_status USING status::public.trip_status;
ALTER TABLE public.trips ALTER COLUMN status SET DEFAULT 'open';

ALTER TABLE public.trips
  ALTER COLUMN user_id SET NOT NULL,
  ADD COLUMN reserved_kg numeric(6,2) NOT NULL DEFAULT 0,
  ADD CONSTRAINT chk_trips_dates
      CHECK (arrival_date >= depart_date),
  ADD CONSTRAINT chk_trips_capacity_positive
      CHECK (capacity_kg > 0),
  ADD CONSTRAINT chk_trips_reserved
      CHECK (reserved_kg >= 0 AND reserved_kg <= capacity_kg);

-- Indexes
CREATE INDEX idx_trips_user_id
  ON public.trips (user_id);
CREATE INDEX idx_trips_open_by_date
  ON public.trips (depart_date)
  WHERE status = 'open';
CREATE INDEX idx_trips_open_route
  ON public.trips (current_location, destination, depart_date)
  WHERE status = 'open';

COMMIT;