import type { Request, Response } from 'express'; 
import { 
  type ReqList, 
  ReqListSchema,
  UpdateReqListSchema
} from '../interface/reqList.interface';

import { 
  createReqList,
  readOneReqList,
  readReqList,
  updateReqList,
  deleteReqList
} from '../services/requestServices';

import { validateBody } from '../utils/validateBody';


async function postReqList(req:Request, res:Response){
  const result = validateBody(ReqListSchema, req.body); 
	if (!result.success) {
    // console.log(z.prettifyError(result.error));
    return res.sendStatus(400);
  }
  
  try{
    const requestData:ReqList = { ...req.body }; 
    await createReqList({ ...requestData });

    return res.sendStatus(201)
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(500); 
  }
}

async function getOneReqList(req:Request<{ id: string }>, res:Response){
  const reqId = req.params.id;
  if(!reqId || typeof reqId !== 'string') return res.sendStatus(400);

  try{
    const reqList = await readOneReqList(reqId);
    return res.status(200).json(reqList);
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

/// tp be changes 
async function getReqList(req:Request, res:Response){
  try{
    const reqList = await readReqList();
    return res.status(200).json(reqList);
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

async function patchReqList(req:Request<{ id: string }>, res:Response){
  const reqId = req.params.id;
  if(!reqId || typeof reqId !== 'string') return res.sendStatus(400);

  const result = validateBody(UpdateReqListSchema, req.body);
  if(!result.success) return res.sendStatus(400);

  try{
    const updatedReq = await updateReqList(reqId, result.data);
    return res.status(200).json(updatedReq);
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

async function removeReqList(req:Request<{ id: string }>, res:Response){
  const reqId = req.params.id;
  if(!reqId || typeof reqId !== 'string') return res.sendStatus(400);

  try{
    await deleteReqList(reqId);
    return res.sendStatus(204);
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(404);
  }
}

export{ 
  postReqList,
  getOneReqList,
  getReqList,
  patchReqList,
  removeReqList,
}