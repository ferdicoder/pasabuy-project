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
  const { data: requests = [], isPending: isRequestsPending } = useFetch<RequestResponse[]>(queryKeys.requests, API.request.getAll);
  const { data: trips = [], isPending: isTripsPending } = useFetch<Trip[]>(queryKeys.trips, API.trips.getAll);
  const { mutate: deleteRequest } = useDelete(API.request.delete, queryKeys.requests);
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
      isRequestsPending={isRequestsPending}
      isTripsPending={isTripsPending}
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