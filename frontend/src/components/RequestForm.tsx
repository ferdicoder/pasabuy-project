import { useState } from "react";
import type { CreateRequestPayload } from "../interface/Request.interface";

interface RequestFormProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRequestPayload) => unknown;
}

const initialState: CreateRequestPayload = {
  title: "",
  estimatedPrice: 0,
  origin: "",
  delivery_location: "",
  description: "",
  imageUrl: "",
};

export default function RequestForm({ isOpen, onClose, onSubmit }: RequestFormProp) {
  const [form, setForm] = useState<CreateRequestPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    field: keyof CreateRequestPayload,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.delivery_location.trim()) return;
    setSubmitting(true);

    try {
      await onSubmit(form);
      setForm(initialState);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div // backdrop-blur-sm
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70  p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-black/30 rounded-2xl bg-white/80 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 border-black/30">
          <div>
           
            <h2 className="text-lg font-semibold text-black leading-tight">
              Post a Request
            </h2>
          </div>
          
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              What do you need?
            </label>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Strawberry"
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
            />
          </div>

          {/* Origin + Delivery */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black/80">
                From (optional)
              </label>
              <input
                value={form.origin}
                onChange={(e) => handleChange("origin", e.target.value)}
                placeholder="Baguio"
                className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black/80">
                Deliver to
              </label>
              <input
                value={form.delivery_location}
                onChange={(e) => handleChange("delivery_location", e.target.value)}
                placeholder="Quezon City"
                className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              Estimated price (₱)
            </label>
            <input
              type="number"
              min={0}
              value={form.estimatedPrice || ""}
              onChange={(e) => handleChange("estimatedPrice", Number(e.target.value))}
              placeholder="0"
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              Details (optional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Size, color, link, or anything the traveler should know"
              rows={3}
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors resize-none"
            />
          </div>

          {/* Image URL placeholder — swap for upload once storage is wired */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              Reference image URL (optional)
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-black/30">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-black hover:border-black/70 hover:text-black/70 border border-black transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.title.trim() || !form.delivery_location.trim()}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-black/90 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {submitting ? "Posting..." : "Post Request"}
          </button>
        </div>
        
      </div>
    </div>
  );
}
