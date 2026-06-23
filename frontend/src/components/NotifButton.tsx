import { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";

export default function NotifButton(){
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      function clickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", clickOutside);
      return () => document.removeEventListener("mousedown", clickOutside);
    }, []);
  
    return (
      <div ref={ref} className="relative">
       <button
       
          onClick={() => setIsOpen(prev => !prev)}
					type="button"
					aria-label="Open notifications"
					className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="w-7 h-7"
					>
						<path d="M12 4a4 4 0 0 0-4 4v2.8c0 .7-.2 1.4-.6 2L6 15h12l-1.4-2.2a3.8 3.8 0 0 1-.6-2V8a4 4 0 0 0-4-4Z" />
						<path d="M10 18a2 2 0 1 0 4 0" />
					</svg>
				</button>

        {isOpen && <Dropdown mode="notif" onClose={() => setIsOpen(false)}/>}
      </div>
    );
}