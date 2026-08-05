import { Link } from "react-router-dom";
import { User, Settings, LogOut, ShoppingBag, Plane } from "lucide-react";

export default function Dropdown({ mode, onClose, onRequestClick, onTripClick}: {
  mode: string;
  onClose: () => void;
  onRequestClick?: () => void;
  onTripClick?: () => void; 
}){
  // Width per mode
  const widthMode = mode === "notif" ? "w-80" : mode === "avatar" ? "w-44" : "w-44";

  return (
    <div className={`absolute right-0 mt-3 ${widthMode} z-50`}>

      {/* Arrow */}
      <div className="absolute -top-2 right-3 w-4 h-2 overflow-visible">
        <svg
          viewBox="0 0 16 8"
          className="w-4 h-2 drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="8,0 16,8 0,8" fill="white" />
          <polyline
            points="0,8 8,0 16,8"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
        {mode === "avatar" && (
          <div className="py-2 px-2 flex flex-col gap-0.5">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-700">Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} className="text-gray-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-700">Settings</span>
            </Link>

            <div className="my-1 border-t border-gray-100" />
              <Link
                to="/signout"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="text-red-500 shrink-0" />
                <span className="text-sm font-semibold text-red-600">Sign Out</span>
              </Link>
          </div>
        )}

        
        {mode === "notif" && (
          <div>
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              <Link
                to="/notification"
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Notification example — someone offered to carry your request.
                </p>
              </Link>
              <Link
                to="/notification"
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-300 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Another notification example — your trip listing was viewed.
                </p>
              </Link>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <Link
                to="/notification"
                onClick={onClose}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                See all notifications
              </Link>
            </div>
          </div>
        )}

        {mode === "create" && (
          <div className="py-2 px-2 flex flex-col gap-0.5">
            
            <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Create New
            </p>

            <button
              onClick={() => {
                onRequestClick?.();
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            > 
              <ShoppingBag size={16} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Request</p>
                <p className="text-[11px] text-gray-400">Post a request to take by travelers</p>
              </div>
            </button>

            <button
               onClick={() => {
                onTripClick?.();
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plane size={16} className="text-indigo-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Trip</p>
                <p className="text-[11px] text-gray-400">Post trip to receive a request</p>
              </div>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
