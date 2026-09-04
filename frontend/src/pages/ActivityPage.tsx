import { useState } from "react";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";
import TripCard from "../components/TripCard";
import { API } from "../config/api";
import { useFetch, usePatch, useDelete } from "../hooks/useAPI";
import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import RequestForm from "../components/RequestForm";

export default function ActivityPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RequestResponse | null>(null);

  const { data: requestData, isPending: reqPending } = useFetch<RequestResponse[]>(
    ["requests"],
    API.request.getAll
  );
  const { data: tripData, isPending: tripPending } = useFetch<Trip[]>(
    ["trips"],
    API.trips.getAll
  );

  const { mutate: deleteRequest } = useDelete(API.request.delete, ["requests"]);
  const { mutate: deleteTrip } = useDelete(API.trips.delete, ["trips"]);
  const { mutateAsync: patchRequest } = usePatch<CreateRequestPayload>(API.request.update, ["requests"]);

  const handlePatchRequest = async (payload: CreateRequestPayload) => {
    if (!editingRequest) return;
    await patchRequest({ id: editingRequest.request_id, payload });
    handleCloseForm();
  };

  const handleOpenEdit = (request: RequestResponse) => {
    setEditingRequest(request);
    setIsRequestFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsRequestFormOpen(false);
    setEditingRequest(null);
  };

  return (
    <>
      <Header username={"current username"} />

      <section className="py-24 px-28 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">My Requests</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {!reqPending && requestData?.map((request) => (
              <RequestCard key={request.request_id} {...request}
                actionLabel="Edit"
                onEdit={() => handleOpenEdit(request)}
                showDeleteIcon onDelete={() => deleteRequest(request.request_id)} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">My Trips</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {!tripPending && tripData?.map((trip) => (
              <TripCard key={trip.trip_id} {...trip}
                actionLabel="Edit"
                showDeleteIcon onDelete={() => deleteTrip(trip.trip_id)} />
            ))}
          </div>
        </div>
      </section>

      <RequestForm
        isOpen={isRequestFormOpen}
        onClose={handleCloseForm}
        onSubmit={handlePatchRequest}
        mode="edit"
        resetKey={editingRequest?.request_id}
        initialValues={editingRequest ? {
          title: editingRequest.title,
          estimated_price: editingRequest.estimated_price,
          origin: editingRequest.origin ?? "",
          delivery_location: editingRequest.delivery_location,
          description: editingRequest.description ?? "",
          imageUrl: editingRequest.imageUrl ?? "",
        } : undefined}
      />
    </>
  );
}