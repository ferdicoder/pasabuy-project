import { type RequestResponse } from "../interface/Request.interface";
import { type Trip } from "../interface/Trip.interface";
import usePull from "../hooks/usePull";

import Header from "../components/Header"; 
import RequestCard from "../components/RequestCard";
import TripCard from "../components/TripCard";




//fisher-yates algo for shuffling
function shuffle(cards: (RequestResponse | Trip)[]){
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function HomePage(){
    const reqData = usePull<RequestResponse>('http://localhost:5000/api/v1/request/getAll');  
    const tripData = usePull<Trip>('http://localhost:5000/api/v1/trips/getAll');

    const cards = [ ...reqData, ...tripData]; 
    const shuffledCards = shuffle(cards)
  return(
     <>

    <Header username="current user"/>

    <section className="py-24">
      <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-6 gap-4 px-16">
        {
          shuffledCards.map((card) =>(
            'request_id' in card ? 
            <RequestCard key={card.request_id} { ...card } homeStyle="break-inside-avoid mb-4" /> 
            : <TripCard key={card.trip_id} { ...card } homeStyle="break-inside-avoid mb-4"/>
          ))
        }
      </div>
    </section>

    </>
  )
}