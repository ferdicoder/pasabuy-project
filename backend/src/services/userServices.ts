import type { User, UpdateUser } from "../interface/user.internface.js";
import { sql } from "../config/query.js";

async function getUserById(id: string): Promise<User> {
  const query = `
    SELECT *
    FROM "user"
    WHERE id = $1
  `;
  const val = [id];

  const user = await sql<User>(query, val);
  if (user.rowCount === 0 || !user.rows[0]) throw new Error("User does not exist");

  return user.rows[0];
}

async function getUserByEmail(email: string): Promise<User> {
  const query = `
    SELECT *
    FROM "user"
    WHERE email = $1
  `;
  const val = [email];

  const user = await sql<User>(query, val);
  if (user.rowCount === 0 || !user.rows[0]) throw new Error("User does not exist");

  return user.rows[0];
}

async function updateUser(userId: string, userData: UpdateUser): Promise<User> {
  await getUserById(userId);

  // coalesce fn to prevent nullish value
  const query = `
    UPDATE "user"
    SET
      name = COALESCE($2, name),
      image = COALESCE($3, image),
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const val = [
    userId,
    userData.name,
    userData.image,
  ];

  const updatedUser = await sql<User>(query, val);
  if (updatedUser.rowCount === 0 || !updatedUser.rows[0]) throw new Error("update failed");

  return updatedUser.rows[0];
}

export {
  getUserById,
  getUserByEmail,
  updateUser
}