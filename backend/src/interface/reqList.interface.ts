import { z } from 'zod'; 

const ReqListSchema = z.object({
  buyer_id: z.string().min(1),
  title: z.string(),
  description: z.string().optional(),
  estimated_price: z.number().nonnegative(),
  origin: z.string(),
  delivery_location: z.string(),
  imageUrl: z.string().min(1)
}); 

const CreateReqListSchema = ReqListSchema.omit({
  buyer_id: true,
});

const UpdateReqListSchema = ReqListSchema.partial();
type CreateReqList = z.infer<typeof CreateReqListSchema>;
type UpdateReqList = z.infer<typeof UpdateReqListSchema>

type ReqList = z.infer<typeof ReqListSchema>

// type UpdateReqList = z.infer<typeof ReqListSchema.partial> returns schema value


export{
  ReqListSchema,
  CreateReqListSchema,
  UpdateReqListSchema
}

export type{
  ReqList,
  CreateReqList,
  UpdateReqList
}