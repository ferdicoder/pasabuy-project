import { type RequestResponse } from "../interface/Request.interface";
import { type Trip } from "../interface/Trip.interface";
import { API } from "../config/api";
import usePull from "../hooks/usePull";

import Header from "../components/Header"; 
import RequestCard from "../components/RequestCard";
import TripCard from "../components/TripCard";



export default function HomePage(){
    const reqData = usePull<RequestResponse>(API.request.getAll);
    const tripData = usePull<Trip>(API.trips.getAll);
    
  return(
     <>
    <Header username="current user"/>

    <section className="py-24 ">

      {/* Matched Request */}
      <div className=" flex flex-col items-center mb-4 gap-y-2 ">

        <div className="flex justify-between w-full px-33 items-center">
          <h2 className="font-extrabold text-xl">Matched Trips</h2>
          
          <h2 className="text-gray-500">View More</h2>
        </div>

        <div className="
            w-full px-32 
            min-w-25 sm:min-w-30 md:min-w-30 lg:min-w-40 xl:min-w-40 2xl:min-2-50
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
            gap-2 sm:gap-2 md:gap-x-5 xl:gap-x-4 xl:gap-y-2 2xl:gap-2
          ">
          {reqData.map((card) =>(
            <RequestCard key={card.request_id} { ...card } homeStyle="break-inside-avoid mb-4" /> 
          ))}
        </div>

      </div>
      
       {/* Matched Trips */}
      <div className=" flex flex-col items-center mb-4 gap-y-2 ">

        <div className="flex justify-between w-full px-33 items-center">
          <h2 className="font-extrabold text-xl">Matched Trips</h2>
          
          <h2 className="text-gray-500">View More</h2>
        </div>

        <div className="
            w-full px-32
            grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
            gap-2 sm:gap-2 md:gap-x-5 xl:gap-x-4 xl:gap-y-2 2xl:gap-2
          ">
          {tripData.map((card) =>(
              <TripCard key={card.trip_id} { ...card } homeStyle="break-inside-avoid mb-4"/>
          ))}
          {tripData.map((card) =>(
              <TripCard key={card.trip_id} { ...card } homeStyle="break-inside-avoid mb-4"/>
          ))}
        </div>

      </div>

      

    </section>
    </>
  )
}