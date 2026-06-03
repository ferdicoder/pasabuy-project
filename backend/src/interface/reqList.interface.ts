import { z } from 'zod'; 

type ReqList = z.infer<typeof ReqListSchema>

const ReqListSchema = z.object({
  buyer_id: z.number().nonnegative(),
  title: z.string(),
  description: z.string().optional(),
  estimated_price: z.number().nonnegative(),
  origin: z.string(),
  delivery_location: z.string(),
})



export{
  ReqListSchema
}

export type{
  ReqList
}