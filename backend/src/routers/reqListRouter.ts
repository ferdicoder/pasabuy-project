import { Router } from "express";
import { 
  postReqList,
  getReqList,
  patchReqList,
  removeReqList
} from "../controllers/requestController";

const reqListRouter = Router(); 

export default reqListRouter
  .post('/create', postReqList)
  .get('/get/:id', getReqList)
  .patch('/update/:id', patchReqList)
  .delete('/delete/:id', removeReqList);

