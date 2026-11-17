import type { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../config/auth.js';
import { UpdateUserSchema } from '../interface/user.internface.js';
import { getUserById, updateUser } from '../services/userServices.js';
import { validateBody } from '../utils/validateBody.js';

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

async function updateCurrentUser(req: Request<{ id: string }>, res: Response) {
  if (!req.user) return res.sendStatus(401);

  const userId = req.params.id;
  if (!userId || typeof userId !== 'string') return res.sendStatus(400);
  if (userId !== req.user.id) return res.sendStatus(403);

  const result = validateBody(UpdateUserSchema, req.body);
  if (!result.success) return res.sendStatus(400);

  try {
    const updatedUser = await updateUser(req.user.id, result.data);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(`Error Message: ${error}`);
    return res.sendStatus(500);
  }
}

export {
  getCurrentUser,
  updateCurrentUser
}