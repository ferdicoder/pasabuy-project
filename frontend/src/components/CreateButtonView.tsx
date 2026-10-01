import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CreateRequestPayload } from "../interface/Request.interface";
import type { CreateTripPayload } from "../interface/Trip.interface";
import Dropdown from "./Dropdown";
import RequestForm from "./RequestForm";
import TripForm from "./TripForm";

interface CreateButtonViewProps {
  isMenuOpen: boolean;
  isRequestFormOpen: boolean;
  isTripFormOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpenRequestForm: () => void;
  onOpenTripForm: () => void;
  onCloseRequestForm: () => void;
  onCloseTripForm: () => void;
  onRequestSubmit: (payload: CreateRequestPayload) => Promise<void>;
  onTripSubmit: (payload: CreateTripPayload) => Promise<void>;
}

export default function CreateButtonView({
  isMenuOpen,
  isRequestFormOpen,
  isTripFormOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenRequestForm,
  onOpenTripForm,
  onCloseRequestForm,
  onCloseTripForm,
  onRequestSubmit,
  onTripSubmit,
}: CreateButtonViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeWhenClickedOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onCloseMenu();
    }

    document.addEventListener("mousedown", closeWhenClickedOutside);
    return () => document.removeEventListener("mousedown", closeWhenClickedOutside);
  }, [onCloseMenu]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggleMenu}
        type="button"
        aria-label="Add item"
        className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
      >
        <Plus size={28} strokeWidth={1.8} />
      </button>

      {isMenuOpen && (
        <Dropdown
          mode="create"
          onClose={onCloseMenu}
          onRequestClick={onOpenRequestForm}
          onTripClick={onOpenTripForm}
        />
      )}

      <RequestForm isOpen={isRequestFormOpen} onClose={onCloseRequestForm} onSubmit={onRequestSubmit} />
      <TripForm isOpen={isTripFormOpen} onClose={onCloseTripForm} onSubmit={onTripSubmit} />
    </div>
  );
}