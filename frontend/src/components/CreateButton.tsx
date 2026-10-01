import { useState } from "react";
import type { CreateRequestPayload } from "../interface/Request.interface";
import type { CreateTripPayload } from "../interface/Trip.interface";
import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { usePost } from "../hooks/useAPI";
import CreateButtonView from "./CreateButtonView";

export default function CreateButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);

  const { mutateAsync: postRequest } = usePost<CreateRequestPayload>(API.request.create, queryKeys.requests);
  const handleRequestSubmit = async (payload: CreateRequestPayload) => {
    await postRequest(payload);
    setIsRequestFormOpen(false);
  };

  const { mutateAsync: postTrip } = usePost<CreateTripPayload>(API.trips.create, queryKeys.trips);
  const handleTripSubmit = async (payload: CreateTripPayload) => {
    await postTrip(payload);
    setIsTripFormOpen(false);
  };

  return <CreateButtonView
    isMenuOpen={isMenuOpen}
    isRequestFormOpen={isRequestFormOpen}
    isTripFormOpen={isTripFormOpen}
    onToggleMenu={() => setIsMenuOpen((open) => !open)}
    onCloseMenu={() => setIsMenuOpen(false)}
    onOpenRequestForm={() => setIsRequestFormOpen(true)}
    onOpenTripForm={() => setIsTripFormOpen(true)}
    onCloseRequestForm={() => setIsRequestFormOpen(false)}
    onCloseTripForm={() => setIsTripFormOpen(false)}
    onRequestSubmit={handleRequestSubmit}
    onTripSubmit={handleTripSubmit}
  />;
}