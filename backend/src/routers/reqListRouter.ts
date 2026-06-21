import { Router } from "express";
import { 
  postReqList,
  getOneReqList,
  getReqList,
  patchReqList,
  removeReqList, 
} from "../controllers/requestController";

const reqListRouter = Router(); 

export default reqListRouter
  .post('/create', postReqList)
  .get('/get/:id', getOneReqList)
  .get('/getAll', getReqList)
  .patch('/update/:id', patchReqList)
  .delete('/delete/:id', removeReqList);

