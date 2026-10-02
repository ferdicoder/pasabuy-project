import type { RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import Header from "./Header";
import RequestCard from "./RequestCard";
import TripCard from "./TripCard";

interface HomeViewProps {
  requests: RequestResponse[];
  trips: Trip[];
}

export default function HomeView({ requests, trips }: HomeViewProps) {
  let isRequestsEmpty = false; 
  let isTripsEmpty = false; 
  if (requests.length === 0) isRequestsEmpty = true; 
  if (trips.length === 0) isTripsEmpty = true; 
  return (
    <>
      <Header />

      <section className="py-24">
        <div className="mb-4 flex flex-col items-center gap-y-2">
          <div className="flex w-full items-center justify-between px-33">
            <h2 className="text-xl font-extrabold">Matched Requests</h2>
            <h2 className="text-gray-500">View More</h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 px-32 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
             {isRequestsEmpty === true ? <p className="col-span-full flex min-h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm font-medium text-gray-500">No matched requests yet.</p> 
             : requests.map((request) => (
              <RequestCard key={request.request_id} {...request} homeStyle="break-inside-avoid mb-4" />
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center gap-y-2">
          <div className="flex w-full items-center justify-between px-33">
            <h2 className="text-xl font-extrabold">Matched Trips</h2>
            <h2 className="text-gray-500">View More</h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 px-32 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
             {isTripsEmpty === true ? <p className="col-span-full flex min-h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm font-medium text-gray-500">No matched trips yet.</p> 
             : trips.map((request) => (
              <TripCard key={request.trip_id} {...request} homeStyle="break-inside-avoid mb-4" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}