 interface Trip {
  trip_id: string;
  user_id: number;
  current_loc: string;
  destination: string;
  depart_date: Date;
  arrival_date: Date;
  capacity_kg: number;
  status: "open" | "full" | "in_transit" | "completed" | "cancelled";
  image_url?: string | null, 
  onClick?: () => (void)
}



export type {
  Trip
}