import type { CreateRequestPayload, RequestResponse } from "../interface/Request.interface";
import type { CreateTripPayload, Trip } from "../interface/Trip.interface";
import Header from "./Header";
import RequestCard from "./RequestCard";
import RequestForm from "./RequestForm";
import TripCard from "./TripCard";
import TripForm from "./TripForm";

interface ActivityViewProps {
  requests: RequestResponse[];
  trips: Trip[];
  isRequestsPending: boolean;
  isTripsPending: boolean;
  editingRequest: RequestResponse | null;
  isRequestFormOpen: boolean;
  isTripFormOpen: boolean;
  editingTrip: Trip | null;
  onDeleteRequest: (id: string) => void;
  onDeleteTrip: (id: string) => void;
  onEditRequest: (request: RequestResponse) => void;
  onEditTrip: (trip: Trip) => void;
  onCloseRequestForm: () => void;
  onCloseTripForm: () => void;
  onCreateRequest: (payload: CreateRequestPayload) => Promise<void>;
  onPatchRequest: (payload: CreateRequestPayload) => Promise<void>;
  onPatchTrip: (payload: CreateTripPayload) => Promise<void>;
}

export default function ActivityView({
  requests,
  trips,
  isRequestsPending,
  isTripsPending,
  editingRequest,
  isRequestFormOpen,
  isTripFormOpen,
  editingTrip,
  onDeleteRequest,
  onDeleteTrip,
  onEditRequest,
  onEditTrip,
  onCloseRequestForm,
  onCloseTripForm,
  onCreateRequest,
  onPatchRequest,
  onPatchTrip,
}: ActivityViewProps) {
  return (
    <>
      <Header />
      <section className="min-h-screen space-y-10 bg-[#fbfaf7] px-28 py-28">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-[#191a17]">My Requests</h2>
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
              <TripCard
                key={trip.trip_id}
                {...trip}
                actionLabel="Edit"
                showDeleteIcon
                onEdit={() => onEditTrip(trip)}
                onDelete={() => onDeleteTrip(trip.trip_id)}
              />
            ))}
          </div>
        </div>
      </section>

      <RequestForm
        key={`${isRequestFormOpen}-${editingRequest?.request_id ?? 'create'}`}
        isOpen={isRequestFormOpen}
        onClose={onCloseRequestForm}
        onSubmit={editingRequest ? onPatchRequest : onCreateRequest}
        mode={editingRequest ? 'edit' : 'create'}
        initialValues={editingRequest ? {
          title: editingRequest.title,
          estimated_price: Number(editingRequest.estimated_price),
          origin: editingRequest.origin ?? "",
          delivery_location: editingRequest.delivery_location ?? "",
          description: editingRequest.description ?? "",
          imageUrl: editingRequest.imageUrl ?? "",
        } : undefined}
      />

      <TripForm
        key={`${isTripFormOpen}-${editingTrip?.trip_id ?? 'create'}`}
        isOpen={isTripFormOpen}
        onClose={onCloseTripForm}
        onSubmit={onPatchTrip}
        mode={editingTrip ? 'edit' : 'create'}
        initialValues={editingTrip ? {
          current_loc: editingTrip.current_loc,
          destination: editingTrip.destination,
          depart_date: editingTrip.depart_date,
          arrival_date: editingTrip.arrival_date,
          capacity_kg: editingTrip.capacity_kg,
          image_url: editingTrip.image_url ?? "",
        } : undefined}
      />
    </>
  );
}