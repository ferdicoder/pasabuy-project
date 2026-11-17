import { LoaderCircle } from "lucide-react";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export default function LoadingSpinner({
  label = "Loading...",
  className = "py-24",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-3 text-black/55 ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle size={22} strokeWidth={2} className="animate-spin text-[#ff6500]" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}