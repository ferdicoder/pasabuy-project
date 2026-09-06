import { pool } from './connectDB.js'; 
import { betterAuth } from 'better-auth';
import "dotenv/config";

export const auth = betterAuth({
  database: pool, 
  baseURL: process.env.BETTER_AUTH_URL,
  advanced:{
    database: {
      generateId: "uuid"
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
})