interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type UpdateUserPayload = Partial<Pick<User, 'name' | 'image'>>

export type{
  User,
  UpdateUserPayload,
}
