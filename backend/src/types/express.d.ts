import type { auth } from "../config/auth.js";

type SessionUser = typeof auth.$Infer.Session.user;

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export {};