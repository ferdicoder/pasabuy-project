import  Avatar  from "./Avatar";
import type { RequestCardProp } from "../interface/Request.interface";
import formatDate from "../utils/formatDate";


export default function RequestCard({ homeStyle, ...cardData }: RequestCardProp & { homeStyle?: string }) {
  const isTaken = cardData.status === 'taken'; 
  let borderColor = isTaken ? 'border-red-400' : 'border-green-800'; 

  return (
    <div className={`flex flex-col rounded-xl bg-white shadow-sm m-0 w-full border ${borderColor} ${homeStyle}`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-100 shrink-0 rounded-t-xl"
      >
        {cardData.imageUrl ? (
          <img
            className="w-full h-full object-cover"
            src={cardData.imageUrl}
            alt={cardData.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}

        {/* Origin */}
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11z"/>
            <circle cx="12" cy="10" r="2"/>
          </svg>
          {cardData.origin ? (`${cardData.origin} to ${cardData.delivery_location}`) : (`to ${cardData.delivery_location}`)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-3.5 flex-1">

        
        <div className="flex justify-between items-start gap-2">
          <p className="font-medium text-[15px] text-gray-900 leading-snug">{cardData.title}</p>
          <span className="shrink-0 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ~₱{cardData.estimated_price}
          </span>
        </div>

        {/* Desc */}
        {cardData.description && (
          <p className="text-sm text-gray-500 leading-relaxed truncate">{cardData.description}</p>
        )}

        <hr className="border-gray-100" />

        {/* Avatar and timestampz */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar username={cardData.buyerUsername} />
            <p className="text-[13px] text-gray-500">{cardData.buyerUsername}</p>
          </div>
          <span className="flex items-center gap-1 text-[12px] text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {`${formatDate(cardData.createdAt)}`}
          </span>
        </div>

        {/* Button */}
        <button
          disabled={isTaken}
          onClick={cardData.onTakeRequest}
          className={`w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 cursor-pointer active:scale-98 text-white text-[1rem] font-medium py-2.5 rounded-lg transition-all duration-150  disabled:cursor-not-allowed disabled:opacity-75`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Take Request
        </button>

      </div>
    </div>
  );
}