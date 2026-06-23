import { Link } from "react-router-dom";

export default function Dropdown({mode,onClose}: { mode: string; onClose: () => void;}){
  let w = 'w-36'; 
  let translate = ''
  if(mode === 'notif'){
     w = 'w-81'; 
     translate = '-translate-x-1/2 translate-y-1/2'
  }
  
  mode === 'create' || 'avatar' ? translate = '-translate-x-1/2': translate
  return (
    <>
    <div className={`absolute left-1 right-1 mt-2 ${w} ${translate} w-fit  bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 px-4`}>
      {mode === "avatar" && (
        <>
        <div className="flex items-center justify-center gap-0">

          <div className="py-2">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div className="px-1">
            <Link to="/profile" onClick={onClose} className="block font-bold text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
          </div>

        </div>

          <div className="flex items-center justify-center gap-0">
          
          <div className="py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          <div className="px-1">
            <Link to="/profile" onClick={onClose} className="block font-bold text-sm text-gray-700 hover:bg-gray-100">
              Settings
            </Link>
          </div>

        </div>

        <div className="flex items-center justify-center gap-0">

          <div className="py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>

          <div className="px-1">
            <Link to="/profile" onClick={onClose} className="block font-bold text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
          </div>

        </div>
          
        </>
      )}
      {mode === 'notif' &&(
        <div className=" p-2 h- ">
          <div className="px-2 block"><h1>Notifications</h1></div>

          <div className=" p-2">
             <div className="border py-4 w-full"><p className="text-[12px]">notif example</p></div>
          </div>
        </div>
      )}
      {mode === 'create' &&(
        <>
          
          <Link
            to="/request"
            onClick={onClose}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            
          >
            Request
          </Link>
          <Link
            to="/trips"
            onClick={onClose}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Trips
          </Link>
        </>
      )}
    </div>
    </>
  );
}
