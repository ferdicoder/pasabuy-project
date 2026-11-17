import { z } from 'zod';

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UpdateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  image: z.string().min(1).optional(),
});

type UpdateUser = z.infer<typeof UpdateUserSchema>

export type { User, UpdateUser }
export { UpdateUserSchema }