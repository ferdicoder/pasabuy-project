import { Router } from "express";
import { 
  registerUser,
  logInUser
} from "../controllers/userController";
import { requireAuth } from "../middlewares/requireAuth";


const userRouter = Router(); 

export default userRouter
  .post('/register', registerUser)
  .post('/login', logInUser, requireAuth)
  