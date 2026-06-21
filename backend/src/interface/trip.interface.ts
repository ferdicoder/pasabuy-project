import { z } from 'zod'; 

const tripSchema = z.object({
  user_id: z.number().nonnegative(), 
  current_loc: z.string(), 
  destination: z.string(),
  depart_date: z.coerce.date(), 
  arrival_date: z.coerce.date(), 
  capacity_kg: z.number().nonnegative(),
  status: z.string()
}); 

const UpdateTripSchema = tripSchema.partial();

type Trip = z.infer<typeof tripSchema>
type UpdateTrip = z.infer<typeof UpdateTripSchema>;

export{
  tripSchema,
  UpdateTripSchema,
  type Trip,
  type UpdateTrip
}