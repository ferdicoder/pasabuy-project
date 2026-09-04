import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import type { CreateRequestPayload } from "../interface/Request.interface";
import type { CreateTripPayload } from "../interface/Trip.interface";
import Dropdown from "./Dropdown";
import RequestForm from "./RequestForm";
import TripForm from "./TripForm";

import { API } from "../config/api";
import { queryKeys } from "../config/queryKeys";
import { usePost } from "../hooks/useAPI";

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label="Add item"
        className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
      >
        <Plus size={28} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <Dropdown
          mode="create"
          onClose={() => setIsOpen(false)}
          onRequestClick={() => setIsRequestFormOpen(true)}
          onTripClick={() => setIsTripFormOpen(true)}
        />
      )}

      <RequestForm
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
        onSubmit={handleRequestSubmit}
      />

      <TripForm
        isOpen={isTripFormOpen}
        onClose={() => setIsTripFormOpen(false)}
        onSubmit={handleTripSubmit}
      />
    </div>
  );
}