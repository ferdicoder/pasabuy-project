 interface Trip {
  trip_id: string;
  username: string;
  current_loc: string;
  destination: string;
  depart_date: Date;
  arrival_date: Date;
  capacity_kg: number;
  status: "open" | "full" | "in_transit" | "completed" | "cancelled";
  image_url?: string | null, 
  onClick?: () => (void)
}

interface TripFormProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTripPayload) => unknown;
}

type CreateTripPayload = Omit<Trip, 'trip_id' | 'onClick' | 'status' > 
  & { user_id: string } // for change dont put PK in FE

export type {
  Trip, 
  CreateTripPayload,
  TripFormProp
}