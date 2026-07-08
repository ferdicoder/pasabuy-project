import { Router } from "express";
import { 
  registerUser,
  logInUser
} from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";


const userRouter = Router(); 

export default userRouter
  .post('/register', registerUser)
  .post('/login', logInUser, requireAuth)
  