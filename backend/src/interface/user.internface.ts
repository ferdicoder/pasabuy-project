import { z } from "zod"
type Users = z.infer<typeof UserSchema>

const UserSchema = z.object({
  email: z.email(), 
  username: z.string(), 
  password: z.string().min(8)
}) 
const LoginSchema = UserSchema.omit({
  username: true
})

// type LoginSchema = Omit<Users, "username">
type DbUser = Users & { user_id: number }

export type{ Users, DbUser }
export{
 UserSchema, 
 LoginSchema
}