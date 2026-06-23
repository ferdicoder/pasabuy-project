import { Link } from "react-router-dom";

export default function Dropdown({mode,onClose,}: { mode: string; onClose: () => void;}){
  return (
    <div className="absolute left-1 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
      {mode === "avatar" && (
        <>
          <Link
            to="/profile"
            onClick={onClose}
            className="block  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
          >
            Sign Out
          </button>
          
        </>
      )}

      {mode === 'notif' && (
        <div>Example</div>
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

    
  );
}


// {mode === 'notification' && (
//         <select>
//           <option value="request">Request</option>
//           <option value="trips">Trips</option>
//         </select>
//       )
//     }
//     {mode === 'create' && (
//         <select>
//           <option value="request">Request</option>
//           <option value="trips">Trips</option>
//         </select>
//       )
//     }