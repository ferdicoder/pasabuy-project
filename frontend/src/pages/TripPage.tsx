import type { Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import { useFetch } from "../hooks/useAPI";
import Header from "../components/Header";
import TripCard from "../components/TripCard";

import { queryKeys } from "../config/queryKeys";

export default function TripPage() {
  const { data: tripData, isPending, isError, error } = useFetch<Trip[]>(
    queryKeys.trips,
    API.trips.getAll
  );

  if (isPending) return <p className="text-center py-24">Loading trips…</p>;
  if (isError) return <p className="text-center py-24 text-red-500">{error.message}</p>;

  return (
    <>
      <Header username="Current User" />

      <section className="py-24 px-8">
        <div className="grid grid-cols-1 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 2xl:gap-4 xl:gap-4 md:gap-3">
          {tripData.map((trip) => (
            <TripCard key={trip.trip_id} {...trip} />
          ))}
        </div>
      </section>
    </>
  );
}