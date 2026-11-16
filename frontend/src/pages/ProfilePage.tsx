import type { RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import type { User } from "../interface/User.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useFetch, useSession } from "../hooks/useAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileView from "../components/ProfileView";

export default function ProfilePage() {
  const { data: user, isPending: isUserPending } = useSession<User>(API.users.me, queryKeys.session);

  const {
    data: requests = [],
    isPending: isRequestsPending
  } = useFetch<RequestResponse[]>(queryKeys.myRequests, API.request.myRequests);

  const {
    data: trips = [],
    isPending: isTripsPending
  } = useFetch<Trip[]>(queryKeys.myTrips, API.trips.myTrips);

  if (isUserPending) return <LoadingSpinner />;
  if (!user) return <p className="py-24 text-center text-red-500">Unable to load your profile.</p>;

  return (
    <ProfileView
      user={user}
      requests={requests}
      trips={trips}
      isRequestsPending={isRequestsPending}
      isTripsPending={isTripsPending}
    />
  );
}
