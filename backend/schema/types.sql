CREATE TYPE public.match_status AS ENUM ('proposed', 'accepted', 'rejected', 'withdrawn', 'expired');
CREATE TYPE public.place_kind AS ENUM ('city', 'municipality');
CREATE TYPE public.request_status AS ENUM ('active', 'taken', 'inactive');
CREATE TYPE public.transaction_status AS ENUM ('awaiting_purchase', 'purchased', 'in_transit', 'delivered', 'completed', 'cancelled', 'disputed');
CREATE TYPE public.trip_status AS ENUM ('open', 'full', 'in_transit', 'completed', 'cancelled');
