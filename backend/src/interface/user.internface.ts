interface Users{
  email: string, 
  username: string, 
  password: string, 
}

type DbUser = Users & {
  user_id: number
}

export type{
  Users, 
  DbUser
}