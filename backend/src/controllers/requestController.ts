import type { Request, Response } from 'express'; 
import { z } from 'zod'; 
import { 
  type ReqList, 
  ReqListSchema 
} from '../interface/reqList.interface';

import { createRequest } from '../services/requestServices';

import { validateBody } from '../utils/validateBody';


async function postReqList(req:Request, res:Response){
  const result = validateBody(ReqListSchema, req.body); 
	if (!result.success) {
    // console.log(z.prettifyError(result.error));
    return res.sendStatus(400);
  }
  
  try{
    const userData:ReqList = { ...req.body }; 
    await createRequest({ ...userData });

    return res.sendStatus(201)
  }catch(error){
    console.log(`${error}`);
    return res.sendStatus(500); 
  }
}

export{ 
  postReqList
}