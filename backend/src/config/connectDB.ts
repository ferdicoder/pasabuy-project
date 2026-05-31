import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: { rejectUnauthorized: false }
});

export async function connectDB() {
  await pool.query("SELECT 1");
  console.log("Database Connected");
  return pool;
}

export { pool };
