import type { RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useFetch } from "../hooks/useAPI";
import HomeView from "../components/HomeView";

export default function HomePage() {
  const { data: requests = [] } = useFetch<RequestResponse[]>(queryKeys.requests, API.request.getAll);
  const { data: trips = [] } = useFetch<Trip[]>(queryKeys.trips, API.trips.getAll);

  return <HomeView requests={requests} trips={trips} />;
}