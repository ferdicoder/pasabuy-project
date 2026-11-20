import { useState } from "react";
import { createPortal } from "react-dom";
import type { CreateTripPayload, TripFormProp } from "../interface/Trip.interface";
import { uploadImage } from "../utils/uploadImage.ts";

function formatDateInput(date: Date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
	return value ? new Date(`${value}T00:00:00`) : new Date("Invalid Date");
}

// the API serializes date columns as full ISO timestamps, while date-only
// inputs give us "yyyy-mm-dd"
function coerceDate(value: Date | string | undefined, fallback: Date) {
	if (value instanceof Date) return value;
	if (typeof value === "string") {
		const trimmed = value.trim();
		// date-only strings parse as local midnight to avoid a UTC shift
		const parsed = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
			? parseDateInput(trimmed)
			: new Date(trimmed);
		if (!Number.isNaN(parsed.getTime())) return parsed;
	}
	return fallback;
}

function buildInitialState(initialValues?: Partial<CreateTripPayload>): CreateTripPayload {
	const now = new Date();
	const base: CreateTripPayload = {
		current_loc: "",
		destination: "",
		depart_date: now,
		arrival_date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
		capacity_kg: 0,
		image_url: "",
	};

	if (!initialValues) return base;

	return {
		...base,
		...initialValues,
		depart_date: coerceDate(initialValues.depart_date, base.depart_date),
		arrival_date: coerceDate(initialValues.arrival_date, base.arrival_date),
	};
}

export default function TripForm({ isOpen, onClose, onSubmit, initialValues, mode = 'create' }: TripFormProp) {
	const [form, setForm] = useState<CreateTripPayload>(() => buildInitialState(initialValues));
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleChange = (field: keyof CreateTripPayload, value: string | number | Date) => {
		setForm((prevState) => ({ ...prevState, [field]: value }));
	};

	const isValid =
		form.current_loc.trim() &&
		form.destination.trim() &&
		form.capacity_kg >= 0 &&
		form.depart_date instanceof Date &&
		!Number.isNaN(form.depart_date.getTime()) &&
		form.arrival_date instanceof Date &&
		!Number.isNaN(form.arrival_date.getTime()) &&
		form.arrival_date >= form.depart_date;

	const handleSubmit = async () => {
		if (!isValid) return;
		setSubmitting(true);
		setError("");

		try {
			await onSubmit(form);
			setForm(buildInitialState(initialValues));
			onClose();
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save trip");
		} finally {
			setSubmitting(false);
		}
	};

	return createPortal(
		<div
			className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-md border border-black/10 rounded-2xl bg-[#fbfaf7] shadow-2xl overflow-hidden"
			>
				<div className="flex items-center justify-between px-5 pt-5 pb-2 border-black/30">
					<div>
						<h2 className="text-lg font-semibold text-black leading-tight">
							{mode === 'edit' ? 'Edit Trip' : 'Post a Trip'}
						</h2>
					</div>
				</div>

				<div className="flex flex-col gap-4 px-5 py-5 max-h-[70vh] overflow-y-auto">
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-black/80">From</label>
							<input
								value={form.current_loc}
								onChange={(e) => handleChange("current_loc", e.target.value)}
								placeholder="Baguio"
								className="w-full bg-white border border-black/12 focus:border-[#ff6500] rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-black/80">To</label>
							<input
								value={form.destination}
								onChange={(e) => handleChange("destination", e.target.value)}
								placeholder="Quezon City"
								className="w-full bg-white border border-black/12 focus:border-[#ff6500] rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-black/80">Departure</label>
							<input
								type="date"
								value={formatDateInput(form.depart_date)}
								onChange={(e) => handleChange("depart_date", parseDateInput(e.target.value))}
								className="w-full bg-white border border-black/12 focus:border-[#ff6500] rounded-lg px-3 py-2.5 text-sm text-black outline-none transition-colors"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-black/80">Arrival</label>
							<input
								type="date"
								value={formatDateInput(form.arrival_date)}
								onChange={(e) => handleChange("arrival_date", parseDateInput(e.target.value))}
								className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black outline-none transition-colors"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-black/80">Capacity (kg)</label>
						<input
							type="number"
							min={0}
							value={form.capacity_kg || ""}
							onChange={(e) => handleChange("capacity_kg", Number(e.target.value))}
							placeholder="0"
							className="w-full bg-white border border-black/12 focus:border-[#ff6500] rounded-lg px-3 py-2.5 text-sm text-black outline-none transition-colors
							[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-black/80">Destination image (optional)</label>
						<input
							type="file"
							accept="image/*"
							onChange={async (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								try {
									setError("");
									handleChange("image_url", await uploadImage(file));
								} catch (uploadError) {
									setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
								}
							}}
							className="w-full bg-white border border-black/12 focus:border-[#ff6500] rounded-lg px-3 py-2.5 text-sm text-black file:mr-3 file:rounded-md file:border-0 file:bg-[#ff6500] file:px-3 file:py-1.5 file:text-sm file:text-[#191a17]"
						/>
						{form.image_url && <img src={form.image_url} alt="Selected destination" className="h-24 w-full rounded-lg object-cover" />}
					</div>
				</div>

				{error && <p className="px-5 pb-2 text-sm text-red-600">{error}</p>}

				<div className="flex items-center gap-3 px-5 py-4 border-t border-black/30">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 rounded-full text-sm font-medium text-black hover:bg-black/7 border border-black/20 transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={submitting || !isValid}
						className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-[#ff6500] text-[#191a17] hover:bg-[#ff7a21] active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
					>
						{submitting
							? (mode === 'edit' ? "Saving..." : "Posting...")
							: (mode === 'edit' ? "Save Changes" : "Post Trip")}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
