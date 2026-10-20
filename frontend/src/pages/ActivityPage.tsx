import { useState } from "react";
import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { useDelete, useFetch, usePatch } from "../hooks/useAPI";
import ActivityView from "../components/ActivityView";

export default function ActivityPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RequestResponse | null>(null);
  
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
  const { mutate: deleteTrip } = useDelete(API.trips.delete, queryKeys.trips);
  const { mutateAsync: patchRequest } = usePatch<CreateRequestPayload>(API.request.update, queryKeys.requests);

  const closeRequestForm = () => {
    setIsRequestFormOpen(false);
    setEditingRequest(null);
  };

  const patchSelectedRequest = async (payload: CreateRequestPayload) => {
    if (!editingRequest) return;
    await patchRequest({ id: editingRequest.request_id, payload });
    closeRequestForm();
  };

  return (
    <ActivityView
      requests={requests}
      trips={trips}
      isRequestsPending={isMyRequestsPending}
      isTripsPending={isMyTripsPending}
      editingRequest={editingRequest}
      isRequestFormOpen={isRequestFormOpen}
      onDeleteRequest={deleteRequest}
      onDeleteTrip={deleteTrip}
      onEditRequest={(request) => {
        setEditingRequest(request);
        setIsRequestFormOpen(true);
      }}
      onCloseRequestForm={closeRequestForm}
      onPatchRequest={patchSelectedRequest}
    />
  );
}