import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

type AuthenticatedRequest = Request & {
  user?: JwtPayload | string;
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return res.sendStatus(401);

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return res.sendStatus(500);

  try {
    const decoded = jwt.verify(token, secret);
    if(!decoded) throw new Error("a")
    req.user = decoded;
    return next();

  } catch (error) {
    console.log(`Error: ${error}`); 
    return res.sendStatus(401);
  }
}

