import Header from "../components/Header";
import RequestCard from "../components/RequestCard";
import TripCard from "../components/TripCard";
import usePull from "../hooks/usePull";
import type { RequestResponse } from "../interface/Request.interface";
import type { Trip } from "../interface/Trip.interface";
import useDelete from "../hooks/useDelete";


export default function ActivityPage(){
  const requestData = usePull<RequestResponse>('http://localhost:5000/api/v1/request/getAll');
  const tripData = usePull<Trip>('http://localhost:5000/api/v1/trips/getAll');

  // deletion of card event
    const { deleteItem: deleteRequest } = useDelete('http://localhost:5000/api/v1/request/delete'); 
    const handleDeleteRequest = async (id: string) =>{
      deleteRequest(id); 
    }
  
    const { deleteItem: deleteTrip } = useDelete('http://localhost:5000/api/v1/trips/delete'); 
    const handleDeleteTrip = async (id: string) =>{
      deleteTrip(id); 
    }

  return(
    <>
      <Header username={'current username'}/>

      <section className="py-24 px-28 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">My Requests</h2>
            <span className="text-sm text-gray-500">Recent activity</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {requestData.map((request) => (
              <RequestCard key={request.request_id} {...request} showCloseIcon onDelete={() => handleDeleteRequest(request.request_id)}/>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">My Trips</h2>
            <span className="text-sm text-gray-500">Recent activity</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {tripData.map((trip) => (
              <TripCard key={trip.trip_id} {...trip} showCloseIcon onDelete={() => handleDeleteTrip(trip.trip_id)}/>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}