import type { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../config/auth.js';
import { getUserById } from '../services/userServices.js';

async function getCurrentUser(req: Request, res: Response) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) return res.sendStatus(401);

  try {
    const user = await getUserById(session.user.id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error Message: ${error}`);
    return res.sendStatus(500);
  }
}

export {
  getCurrentUser
}