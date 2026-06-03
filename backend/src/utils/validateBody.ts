import { z } from 'zod'; 

export function validateBody<T>(schema: z.ZodType<T>, body: unknown){
  return schema.safeParse(body);
}