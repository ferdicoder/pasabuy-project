import type { DbUser } from "../interface/user.internface.js";
import { sql } from "../config/query.js";

async function getUserById(id: string): Promise<DbUser> {
  const query = `
    SELECT *
    FROM "user"
    WHERE id = $1
  `;
  const val = [id];

  const user = await sql<DbUser>(query, val);
  if (user.rowCount === 0 || !user.rows[0]) throw new Error("User does not exist");

  return user.rows[0];
}

async function getUserByEmail(email: string): Promise<DbUser> {
  const query = `
    SELECT *
    FROM "user"
    WHERE email = $1
  `;
  const val = [email];

  const user = await sql<DbUser>(query, val);
  if (user.rowCount === 0 || !user.rows[0]) throw new Error("User does not exist");

  return user.rows[0];
}

export {
  getUserById,
  getUserByEmail
}