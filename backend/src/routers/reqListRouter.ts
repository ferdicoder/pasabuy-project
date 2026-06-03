import { Router } from "express";
import { 
  postReqList 
} from "../controllers/requestController";

const reqListRouter = Router(); 

export default reqListRouter
  .post('/create', postReqList)

