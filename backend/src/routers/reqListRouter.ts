import { Router } from "express";
import { 
  postReqList,
  getOneReqList,
  getReqList,
  patchReqList,
  removeReqList, 
  getMyRequests
} from "../controllers/requestController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const reqListRouter = Router(); 

export default reqListRouter
  .post('/create', requireAuth, postReqList)
  .get('/get/:id', getOneReqList)
  .get('/getAll', getReqList)
  .patch('/update/:id', requireAuth, patchReqList)
  .delete('/delete/:id', requireAuth, removeReqList)
  .get('/myRequests', requireAuth, getMyRequests)
