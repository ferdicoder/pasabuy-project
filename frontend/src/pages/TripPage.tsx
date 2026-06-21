import type { Trip } from '../interface/Trip.interface'
import usePull from '../hooks/usePull'; 
import Header from "../components/Header";
import TripCard from "../components/TripCard";

/*
  change the database and put image url for target destinatio 
*/

export default function TripPage(){
  const tripData = usePull<Trip>('http://localhost:5000/api/v1/trips/getAll')

  return (
    <section className="py-24">
      <Header username="Current User"/>

      <div className="grid grid-cols-1 2xl:grid-cols-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 gap-4 px-16">
          {
            tripData.map(trip =>(
              <TripCard key={trip.trip_id} { ...trip } />
            ))
          }
      </div>
    </section>
  )
}