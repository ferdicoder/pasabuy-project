import { useState } from "react";
import type { UpdateUserPayload } from "../interface/User.interface";
import { uploadImage } from "../utils/uploadImage.ts";

interface ProfileFormProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => unknown;
  initialValues?: { name: string; image: string };
}

export default function ProfileForm({ isOpen, onClose, onSubmit, initialValues }: ProfileFormProp) {

  const [form, setForm] = useState(() => ({
    name: initialValues?.name ?? "",
    image: initialValues?.image ?? ""
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prevState) => ({ ...prevState, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const payload: UpdateUserPayload = { name: form.name.trim() };
      if (form.image) payload.image = form.image;
      await onSubmit(payload);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
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
              Edit Profile
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-5 max-h-[70vh] overflow-y-auto">
          {/* Photo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              Profile photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  setError("");
                  handleChange("image", await uploadImage(file));
                } catch (uploadError) {
                  setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
                }
              }}
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-sm file:text-white"
            />
            {form.image && <img src={form.image} alt="Selected profile photo" className="h-32 w-32 rounded-full object-cover self-center" />}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-black/80">
              Display name
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Juan Dela Cruz"
              className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
            />
          </div>
        </div>

        {error && <p role="alert" className="px-5 pb-2 text-sm text-red-600">{error}</p>}

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
            disabled={submitting || !form.name.trim()}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-black/90 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
