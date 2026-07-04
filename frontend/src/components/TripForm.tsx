import { useState } from "react";
import type { CreateTripPayload, TripFormProp } from "../interface/Trip.interface";

function formatDateInput(date: Date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export default function TripForm({ isOpen, onClose, onSubmit }: TripFormProp) {
	const now = new Date();
	const initialState: CreateTripPayload = {
		user_id: 6, // for change dont put primary key in FE
		username: "", 
		current_loc: "",
		destination: "",
		depart_date: now,
		arrival_date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
		capacity_kg: 0,
		image_url: "",
	};

	const [form, setForm] = useState<CreateTripPayload>(initialState);
	const [submitting, setSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleChange = (field: keyof CreateTripPayload, value: string | number | Date) => {
		setForm((prevState) => ({ ...prevState, [field]: value }));
	};

	const parseDateInput = (value: string) => {
		return value ? new Date(`${value}T00:00:00`) : new Date("Invalid Date");
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

		try {
			await onSubmit(form);
			setForm(initialState);
			onClose();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-md border border-black/30 rounded-2xl bg-white/80 shadow-2xl overflow-hidden"
			>
				<div className="flex items-center justify-between px-5 pt-5 pb-2 border-black/30">
					<div>
						<h2 className="text-lg font-semibold text-black leading-tight">Post a Trip</h2>
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
								className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-medium text-black/80">To</label>
							<input
								value={form.destination}
								onChange={(e) => handleChange("destination", e.target.value)}
								placeholder="Quezon City"
								className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
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
								className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black outline-none transition-colors"
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
							className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors
							[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-black/80">Destination image URL (optional)</label>
						<input
							value={form.image_url ?? ""}
							onChange={(e) => handleChange("image_url", e.target.value)}
							placeholder="https://..."
							className="w-full bg-white/5 border border-black/30 focus:border-black rounded-lg px-3 py-2.5 text-sm text-black placeholder:text-black/30 outline-none transition-colors"
						/>
					</div>
				</div>

				<div className="flex items-center gap-3 px-5 py-4 border-t border-black/30">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 rounded-lg text-sm font-medium text-black hover:border-black/70 hover:text-black/70 border border-black transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={submitting || !isValid}
						className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-black text-white hover:bg-black/90 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
					>
						{submitting ? "Posting..." : "Post Trip"}
					</button>
				</div>
			</div>
		</div>
	);
}
