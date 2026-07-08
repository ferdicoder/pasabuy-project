import { Calendar, PencilLine, Plane, ShoppingBag, X } from "lucide-react";
import formatDate from "../utils/formatDate";
import type { Trip } from "../interface/Trip.interface";
import Avatar from "./Avatar";

const statusColor: Record<Trip["status"], { label: string; bg: string; text: string; dot: string }> = {
  open:       { label: "Open",       bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
  full:       { label: "Full",       bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500"   },
  in_transit: { label: "In Transit", bg: "bg-sky-50",      text: "text-sky-700",     dot: "bg-sky-500"     },
  completed:  { label: "Completed",  bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400"   },
  cancelled:  { label: "Cancelled",  bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400"     },
};

function ImagePlaceholder({ destination }: { destination: string }) {
  const initial = destination.trim().charAt(0).toUpperCase();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-amber-400 to-orange-500 select-none">
      <span className="text-white text-2xl font-bold leading-none">{initial}</span>
      <Plane className="mt-1 text-white/70" size={16} strokeWidth={2} />
    </div>
  );
}

function TravelerAvatar({ username, avatar_url }: { username: string; avatar_url?: string | null }) {
  return avatar_url ? (
    <img
      src={avatar_url}
      alt={username}
      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
    />
  ) : (
    // <span className="w-5 h-5 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[9px] font-bold ring-1 ring-amber-200 shrink-0">
    //   {initial}
    // </span>
    <Avatar username={username} tripStyle="w-5 h-5 shrink-0"/>
  );
}

type TripCardViewProps = Trip & {
  homeStyle?: string;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
  actionLabel?: string;
  onEdit?: () => void;
};

export function TripCard({ homeStyle, showDeleteIcon, onDelete, actionLabel, onEdit, ...tripData }: TripCardViewProps) {
  const statusCfg = statusColor[tripData.status] ?? statusColor.open;

  return (
    <article
      onClick={tripData.onClick}
      className={[
        homeStyle ?? "",
        "group relative flex w-full max-w-sm overflow-visible rounded-2xl",
        "bg-white border border-slate-200/80",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200 ease-out",
        tripData.onClick ? "cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]" : "",
      ].join(" ")}
    >
      {showDeleteIcon && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.();
          }}
          aria-label="Delete trip"
          className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      )}

      {/* Left: destination image */}
      <div className="relative w-22 shrink-0 overflow-hidden rounded-l-2xl">
        {tripData.image_url ? (
          <img
            src={tripData.image_url}
            alt={tripData.destination}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder destination={tripData.destination} />
        )}
        <div className="absolute inset-y-0 right-0 w-5 bg-linear-to-r from-transparent to-white pointer-events-none" />
      </div>

      {/* Right: info */}
      <div className="flex flex-1 flex-col justify-between px-3 py-2.5 min-w-0">

        {/* Top: Route + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {tripData.current_loc}
            </span>
            <Plane className="shrink-0 text-amber-400" size={14} strokeWidth={2} />
            <span className="truncate text-[11px] font-bold text-slate-800 uppercase tracking-wide">
              {tripData.destination}
            </span>
          </div>
          <span
            className={[
              "shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5",
              "text-[10px] font-semibold leading-none",
              statusCfg.bg, statusCfg.text,
            ].join(" ")}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Middle: Dates */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar size={11} strokeWidth={2} />
          <span className="text-[8px]">{`Depart: ${formatDate(tripData.depart_date)}`}</span>
          <span className="text-slate-300">–</span>
          <span className="text-[8px]">{`Arrive: ${formatDate(tripData.arrival_date)}`}</span>
        </div>

        {/* Bottom: Capacity + Traveler */}
        <div className="mt-1.5 flex items-center gap-7">

          {/* Traveler: avatar + username */}
          <div className="flex items-center gap-0.5 min-w-0">
            <TravelerAvatar username={tripData.username} />
            <span className="truncate text-[9px] font-medium text-slate-500">
              {tripData.username}
            </span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-0.5">
            <ShoppingBag size={11} strokeWidth={3} className="text-slate-400" />
            <span className="text-[11px] font-medium text-slate-600">
              {tripData.capacity_kg}kg
            </span>
          </div>

        </div>

        {actionLabel && (
          <button
            type="button"
            onClick={onEdit}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-400 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
          >
            <PencilLine className="h-4 w-4" strokeWidth={2} />
            {actionLabel}
          </button>
        )}

      </div>
    </article>
  );
}

export default TripCard;
