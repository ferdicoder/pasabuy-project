import type { 
  DbUser,
  Users
} from "../interface/user.internface.js";
import { sql } from "../config/query.js";



async function createUser({ ...userData }: Users){ 
  const {  username, password, email } = userData; 
  
  const query = `
    INSERT INTO users (username, password, email)
    VALUES($1, $2, $3)
    RETURNING *
  `; 
  const val = [username, password, email]; 
  
  const newUser = await sql<DbUser>(query, val); 
  if(newUser.rowCount === 0) throw new Error('registration failed'); 
  // const row = newUser.rows[0];
  // if(!row) throw new Error('registration failed');

  // return row;
  if(newUser.rowCount === 0 || !newUser.rows[0]) throw new Error("User does not exist");

  return newUser.rows[0];
}


async function readUser(email: string):Promise<DbUser>{
  const query = `
    SELECT *
    FROM users 
    WHERE email = $1
  `
  const val = [email]; 

  const user = await sql<DbUser>(query, val); 
  if(user.rowCount === 0 || !user.rows[0]) throw new Error("User does not exist");

  return user.rows[0];
}

async function issueToken(token: string, user_id: number){
  // expiration date conversion
  const duration = 7
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + duration);
  const expires_at = expiresDate.toISOString().slice(0, 10);
  
  const query = `
    INSERT INTO refresh_tokens (user_id, token, duration, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const val = [user_id, token, duration, expires_at];
  
  const result = await sql(query, val);
  if(result.rowCount === 0) throw new Error("Failed to issue refresh token");

  return result.rows[0];
}

export{
  createUser,
  readUser, 
  issueToken
}