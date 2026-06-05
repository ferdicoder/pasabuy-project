import { z } from 'zod'; 

const ReqListSchema = z.object({
  buyer_id: z.number().nonnegative(),
  title: z.string(),
  description: z.string().optional(),
  estimated_price: z.number().nonnegative(),
  origin: z.string(),
  delivery_location: z.string(),
}); 
const UpdateReqListSchema = ReqListSchema.partial();

type ReqList = z.infer<typeof ReqListSchema>
type UpdateReqList = z.infer<typeof UpdateReqListSchema>
// type UpdateReqList = z.infer<typeof ReqListSchema.partial> returns schema value


export{
  ReqListSchema,
  UpdateReqListSchema
}

export type{
  ReqList,
  UpdateReqList
}