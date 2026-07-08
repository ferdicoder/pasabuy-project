import type { Trip } from '../interface/Trip.interface'
import { API } from '../config/api';
import usePull from '../hooks/usePull'; 
import Header from "../components/Header";
import TripCard from "../components/TripCard";

/*
  change the database and put image url for target destinatio 
*/

export default function TripPage(){
  const tripData = usePull<Trip>(API.trips.getAll)

  return (
    <>
    <Header username="Current User"/>
    
    <section className="py-24 px-8">
      <div className="grid grid-cols-1 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 2xl:gap-4 xl:gap-4 md:gap-3">
          {
            tripData.map(trip =>(
              <TripCard key={trip.trip_id} { ...trip } />
            ))
          }
      </div>
    </section>
    </>
  )
}