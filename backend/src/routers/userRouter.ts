import { Router } from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const userRouter = Router();

export default userRouter
  .get('/me', requireAuth, getCurrentUser)
  .patch('/update/:id', requireAuth, updateCurrentUser);