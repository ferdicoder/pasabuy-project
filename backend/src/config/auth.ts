import { pool } from './connectDB.js'; 
import { betterAuth } from 'better-auth';
import "dotenv/config";

export const auth = betterAuth({
  database: pool, 
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
  session:{
    expiresIn: 604800,           // 7d duration in seconds 
    updateAge: 86400,            // 1d refresh interval in seconds
    disableSessionRefresh: false, 
    cookieCache: {
      enabled: true,
      maxAge: 300                // 5min cache duration in seconds
    }
  }
})