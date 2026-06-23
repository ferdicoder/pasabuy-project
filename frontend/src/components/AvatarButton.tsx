import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import Dropdown from "./Dropdown";

export default function AvatarButton({ username }: { username: string }) {
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
        className="cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300"
      >
        <Avatar username={username} />
      </button>

      {isOpen && <Dropdown mode="avatar" onClose={() => setIsOpen(false)} />}
    </div>
  );
}