import { Clock, MapPin, PencilLine, ShoppingBag, X } from "lucide-react";
import Avatar from "./Avatar";
import type { RequestResponse } from "../interface/Request.interface";
import formatDate from "../utils/formatDate";

interface RequestCardProp extends RequestResponse{
  onTakeRequest?: () => unknown;
  homeStyle?: string;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
  actionLabel?: string;
  onEdit?: () => void;
}

export default function RequestCard({ homeStyle, onTakeRequest, showDeleteIcon,  onDelete, actionLabel, onEdit, ...cardData }: RequestCardProp) {
  const isTaken = cardData.status === 'taken'; 
  let borderColor = isTaken ? 'border-red-400' : 'border-green-800'; 

  return (
    <div className={`relative flex flex-col rounded-xl bg-white shadow-sm m-0 w-full border ${borderColor} ${homeStyle}`}>
      {showDeleteIcon && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete request"
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      )}

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
          <MapPin className="w-3 h-3" strokeWidth={2} />
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
            <Clock className="w-3.5 h-3.5" strokeWidth={2} />
            {`${formatDate(cardData.createdAt)}`}
          </span>
        </div>

        {/* Button */}
        <button
          disabled={isTaken}
          onClick={actionLabel === 'Edit' ? onEdit : onTakeRequest}
          className={`w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 cursor-pointer active:scale-98 text-white text-[1rem] font-medium py-2.5 rounded-lg transition-all duration-150  disabled:cursor-not-allowed disabled:opacity-75`}
        >
          {actionLabel === 'Edit' ? (
            <PencilLine className="w-4 h-4" strokeWidth={2} />
          ) : (
            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          )}
          {actionLabel ?? 'Take Request'}
        </button>

      </div>
    </div>
  );
}