import { Link } from "react-router-dom";

export default function Dropdown({ mode, onClose,}: {mode: string; onClose: () => void;}) {
  // Width per mode
  const widthMode = mode === "notif" ? "w-80" : mode === "avatar" ? "w-44" : "w-44";

  // Horizontal offset — arrow is centered via left-1/2 -translate-x-1/2
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
        {/* for avatar*/}
        {mode === "avatar" && (
          <div className="py-2 px-2 flex flex-col gap-0.5">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-gray-500 shrink-0"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-gray-500 shrink-0"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Settings</span>
            </Link>

            {/* Divider before sign out */}
            <div className="my-1 border-t border-gray-100" />

            <Link
              to="/signout"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-red-500 shrink-0"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-sm font-semibold text-red-600">Sign Out</span>
            </Link>
          </div>
        )}

        {/* notif */}
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

        {/* create */}
        {mode === "create" && (
          <div className="py-2 px-2 flex flex-col gap-0.5">
            {/* Label */}
            <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Create New
            </p>

            {/* REQ */}
            <Link
              to="/request"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-blue-500 shrink-0"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-700">Request</p>
                <p className="text-[11px] text-gray-400">Post a request to take by travelers</p>
              </div>
            </Link>

            {/* TRIP */}
            <Link
              to="/trips"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-indigo-500 shrink-0"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2l-.5 1 7 3-3 3 1 2 2 1 3-3 3 7 1-.5z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-700">Trip</p>
                <p className="text-[11px] text-gray-400">Post trip to receive a request</p>
              </div>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
