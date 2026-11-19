import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import { Plus } from "lucide-react";
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
  onOpenCreateRequestForm: () => void;
  onCloseRequestForm: () => void;
  onCreateRequest: (payload: CreateRequestPayload) => Promise<void>;
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
  onOpenCreateRequestForm,
  onCloseRequestForm,
  onCreateRequest,
  onPatchRequest,
}: ActivityViewProps) {
  return (
    <>
      <Header />
      <section className="min-h-screen space-y-10 bg-[#fbfaf7] px-28 py-28">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-[#191a17]">My Requests</h2>
            <button
              type="button"
              onClick={onOpenCreateRequestForm}
              aria-label="Post a request"
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#ff6500] px-4 py-2 text-sm font-semibold text-[#191a17] transition-colors hover:bg-[#ff7a21] active:scale-98"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Post Request
            </button>
          </div>
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
          <h2 className="text-xl font-semibold tracking-tight text-[#191a17]">My Trips</h2>
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
        onSubmit={editingRequest ? onPatchRequest : onCreateRequest}
        mode={editingRequest ? 'edit' : 'create'}
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