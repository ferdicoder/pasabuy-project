import type { Trip } from "../interface/Trip.interface";
import Header from "./Header";
import TripCard from "./TripCard";

interface TripViewProps {
  trips: Trip[];
}

export default function TripView({ trips }: TripViewProps) {
  return (
    <>
      <Header />
      <section className="px-8 py-24">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3 xl:gap-4 2xl:grid-cols-4 2xl:gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.trip_id} {...trip} />
          ))}
        </div>
      </section>
    </>
  );
}