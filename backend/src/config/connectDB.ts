import { Pool } from "pg";
import 'dotenv/config'; 

export async function connectDB() {
  const connect = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT), 
    ssl: { rejectUnauthorized: false }
  });

  console.log('Database Connected');
  return connect;
}


