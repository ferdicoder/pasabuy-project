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
      <svg className="mt-1 text-white/70" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2a1.5 1.5 0 0 0-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
      </svg>
    </div>
  );
}

function TravelerAvatar({ username, avatar_url }: { username: string; avatar_url?: string | null }) {
  const initial = username.trim().charAt(0).toUpperCase();
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

export function TripCard({ homeStyle, ...tripData }: Trip & { homeStyle?: string }) {
  const statusCfg = statusColor[tripData.status] ?? statusColor.open;

  return (
    <article
      onClick={tripData.onClick}
      className={[
        homeStyle ?? "",
        "group relative flex w-full max-w-sm overflow-hidden rounded-2xl",
        "bg-white border border-slate-200/80",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200 ease-out",
        tripData.onClick ? "cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]" : "",
      ].join(" ")}
    >
      {/* Left: destination image */}
      <div className="relative w-22 shrink-0 overflow-hidden">
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
            <svg className="shrink-0 text-amber-400" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2a1.5 1.5 0 0 0-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
            </svg>
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
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M9 3h6l1 4H8L9 3Z" />
              <path d="M3 7h18l-2 13H5L3 7Z" />
            </svg>
            <span className="text-[11px] font-medium text-slate-600">
              {tripData.capacity_kg}kg
            </span>
          </div>

          
        </div>

      </div>
    </article>
  );
}

export default TripCard;
