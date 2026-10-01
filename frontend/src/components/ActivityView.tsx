import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import Header from "./Header";
import RequestCard from "./RequestCard";
import RequestForm from "./RequestForm";
import TripCard from "./TripCard";

interface ActivityViewProps {
  requests: RequestResponse[];
  trips: Trip[];
  isRequestsPending: boolean;
  isTripsPending: boolean;
  editingRequest: RequestResponse | null;
  isRequestFormOpen: boolean;
  onDeleteRequest: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onEditRequest: (request: RequestResponse) => void;
  onCloseRequestForm: () => void;
  onPatchRequest: (payload: CreateRequestPayload) => Promise<void>;
}

export default function ActivityView({
  requests,
  trips,
  isRequestsPending,
  isTripsPending,
  editingRequest,
  isRequestFormOpen,
  onDeleteRequest,
  onDeleteTrip,
  onEditRequest,
  onCloseRequestForm,
  onPatchRequest,
}: ActivityViewProps) {
  return (
    <>
      <Header />
      <section className="space-y-10 px-28 py-24">
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">My Requests</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {!isRequestsPending && requests.map((request) => (
              <RequestCard
                key={request.request_id}
                {...request}
                actionLabel="Edit"
                onEdit={() => onEditRequest(request)}
                showDeleteIcon
                onDelete={() => onDeleteRequest(request.request_id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">My Trips</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {!isTripsPending && trips.map((trip) => (
              <TripCard key={trip.trip_id} {...trip} actionLabel="Edit" showDeleteIcon onDelete={() => onDeleteTrip(trip.trip_id)} />
            ))}
          </div>
        </div>
      </section>

      <RequestForm
        isOpen={isRequestFormOpen}
        onClose={onCloseRequestForm}
        onSubmit={onPatchRequest}
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