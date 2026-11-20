import { useState } from "react";
import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { CreateTripPayload, Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useDelete, useFetch, usePatch, usePost } from "../hooks/useAPI";
import ActivityView from "../components/ActivityView";

export default function ActivityPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RequestResponse | null>(null);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  
  // fetch activity data
  const {
    data: requests = [],
    isPending: isMyRequestsPending
  } = useFetch<RequestResponse[]>(queryKeys.myRequests, API.request.myRequests);

  const {
    data: trips = [],
    isPending: isMyTripsPending
  } = useFetch<Trip[]>(queryKeys.myTrips, API.trips.myTrips)
  

  // mutating & updating
  const { mutate: deleteRequest } = useDelete(API.request.delete, queryKeys.myRequests);
  const { mutateAsync: createRequest } = usePost<CreateRequestPayload>(API.request.create, queryKeys.myRequests);
  const { mutateAsync: patchRequest } = usePatch<CreateRequestPayload>(API.request.update, queryKeys.myRequests);

  const { mutate: deleteTrip } = useDelete(API.trips.delete, [queryKeys.myTrips, queryKeys.trips]);
  const { mutateAsync: patchTrip } = usePatch<CreateTripPayload>(API.trips.update, [queryKeys.myTrips, queryKeys.trips]);

  const closeRequestForm = () => {
    setIsRequestFormOpen(false);
    setEditingRequest(null);
  };

  const closeTripForm = () => {
    setIsTripFormOpen(false);
    setEditingTrip(null);
  };

  const postNewRequest = async (payload: CreateRequestPayload) => {
    await createRequest(payload);
    closeRequestForm();
  };

  const patchSelectedRequest = async (payload: CreateRequestPayload) => {
    if (!editingRequest) return;
    await patchRequest({ id: editingRequest.request_id, payload });
    closeRequestForm();
  };

  const patchSelectedTrip = async (payload: CreateTripPayload) => {
    if (!editingTrip) return;
    await patchTrip({ id: editingTrip.trip_id, payload });
    closeTripForm();
  };

  return (
    <ActivityView
      requests={requests}
      trips={trips}
      isRequestsPending={isMyRequestsPending}
      isTripsPending={isMyTripsPending}
      editingRequest={editingRequest}
      isRequestFormOpen={isRequestFormOpen}
      isTripFormOpen={isTripFormOpen}
      editingTrip={editingTrip}
      onDeleteRequest={deleteRequest}
      onDeleteTrip={deleteTrip}
      onEditRequest={(request) => {
        setEditingRequest(request);
        setIsRequestFormOpen(true);
      }}
      onEditTrip={(trip) => {
        setEditingTrip(trip);
        setIsTripFormOpen(true);
      }}
      onCloseRequestForm={closeRequestForm}
      onCloseTripForm={closeTripForm}
      onCreateRequest={postNewRequest}
      onPatchRequest={patchSelectedRequest}
      onPatchTrip={patchSelectedTrip}
    />
  );
}