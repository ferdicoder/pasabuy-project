import { z } from 'zod'; 

const tripSchema = z.object({
  user_id: z.string().min(1), 
  current_loc: z.string(), 
  destination: z.string(),
  depart_date: z.coerce.date(), 
  arrival_date: z.coerce.date(), 
  capacity_kg: z.number().nonnegative(),
  image_url: z.string().optional(),
  status: z.string().optional()
}); 

const CreateTripSchema = tripSchema.omit({
  user_id: true,
});

const UpdateTripSchema = tripSchema.partial();

type Trip = z.infer<typeof tripSchema>
type CreateTrip = z.infer<typeof CreateTripSchema>;
type UpdateTrip = z.infer<typeof UpdateTripSchema>;

export{
  tripSchema,
  CreateTripSchema,
  UpdateTripSchema,
  type CreateTrip,
  type Trip,
  type UpdateTrip
}