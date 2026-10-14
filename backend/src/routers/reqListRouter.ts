import { Router } from "express";
import { 
  postReqList,
  getOneReqList,
  getReqList,
  patchReqList,
  removeReqList, 
} from "../controllers/requestController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const reqListRouter = Router(); 

export default reqListRouter
  .post('/create', requireAuth, postReqList)
  .get('/get/:id', getOneReqList)
  .get('/getAll', getReqList)
  .patch('/update/:id', patchReqList)
  .delete('/delete/:id', removeReqList);
