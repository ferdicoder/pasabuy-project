import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, CalendarDays, Clock, Mail, Plane, ShoppingBag } from "lucide-react";
import type { RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import type { User } from "../interface/User.interface";
import Avatar from "./Avatar";
import Header from "./Header";

interface ProfileViewProps {
  user: User;
  requests: RequestResponse[];
  trips: Trip[];
  isRequestsPending: boolean;
  isTripsPending: boolean;
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#7C3AED]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function ProfileView({
  user,
  requests,
  trips,
  isRequestsPending,
  isTripsPending,
}: ProfileViewProps) {
  const requestCount = isRequestsPending ? "—" : String(requests.length);
  const tripCount = isTripsPending ? "—" : String(trips.length);

  return (
    <>
      <Header />
      <section className="space-y-8 px-28 py-24">
        {/* Hero card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="h-32 bg-linear-to-r from-[#7C3AED] to-[#A78BFA]" />
          <div className="flex flex-col gap-6 px-8 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.name} avatar`}
                  className="-mt-16 h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-white"
                />
              ) : (
                <Avatar
                  username={user.name}
                  tripStyle="-mt-16 h-28 w-28 shrink-0 rounded-full ring-4 ring-white"
                />
              )}
              <div className="space-y-2 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
                  {user.emailVerified ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <BadgeCheck size={13} strokeWidth={2.2} aria-hidden="true" />
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      Unverified
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                  {user.email}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
                  Joined {formatMonthYear(user.createdAt)}
                </p>
              </div>
            </div>

            <Link
              to="/activities"
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <ShoppingBag size={16} strokeWidth={2} aria-hidden="true" />
              My Activity
            </Link>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={<ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />}
              label="Requests posted"
              value={requestCount}
            />
            <StatCard
              icon={<Plane size={20} strokeWidth={1.8} aria-hidden="true" />}
              label="Trips posted"
              value={tripCount}
            />
            <StatCard
              icon={<CalendarDays size={20} strokeWidth={1.8} aria-hidden="true" />}
              label="Member since"
              value={formatMonthYear(user.createdAt)}
            />
          </div>
        </div>

        {/* Account details */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-extrabold text-gray-900">Account Details</h2>
          </div>
          <ul className="divide-y divide-gray-50 px-6">
            <li className="flex flex-wrap items-center justify-between gap-2 py-4">
              <span className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} strokeWidth={1.8} className="text-gray-400" aria-hidden="true" />
                Email
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                {user.email}
                {user.emailVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">
                    <BadgeCheck size={12} strokeWidth={2.2} aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    Pending
                  </span>
                )}
              </span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2 py-4">
              <span className="flex items-center gap-3 text-sm text-gray-500">
                <CalendarDays size={16} strokeWidth={1.8} className="text-gray-400" aria-hidden="true" />
                Joined
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {new Intl.DateTimeFormat("en-PH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(user.createdAt))}
              </span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2 py-4">
              <span className="flex items-center gap-3 text-sm text-gray-500">
                <Clock size={16} strokeWidth={1.8} className="text-gray-400" aria-hidden="true" />
                Last updated
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {new Intl.DateTimeFormat("en-PH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(user.updatedAt))}
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
