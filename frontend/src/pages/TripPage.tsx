import type { Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useFetch } from "../hooks/useAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import TripView from "../components/TripView";


export default function TripPage() {
  const { data: trips, isPending, isError, error } = useFetch<Trip[]>(queryKeys.trips, API.trips.getAll);

  if (isPending) return <LoadingSpinner />;
  if (isError) return <p className="py-24 text-center text-red-500">{error.message}</p>;

  return <TripView trips={trips ?? []} />;
}