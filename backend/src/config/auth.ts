import { pool } from './connectDB.js'; 
import { betterAuth } from 'better-auth';
import "dotenv/config";

const trustedOrigins = [
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

export const auth = betterAuth({
  database: pool, 
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
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