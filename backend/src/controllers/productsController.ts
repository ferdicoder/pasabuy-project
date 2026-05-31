import type { Request, Response } from "express";

import type { addProductBody, changeProductBody } from "../interface/product.interface";


import { 
  createProduct, 
  readOneProduct,
  updateProduct, 
  deleteOneProduct
} from "../services/productServices";

// validate addProduct request
function isBody(body: unknown): body is { userId: number; name: string; quantity: number } {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.userId === "number" &&
    typeof b.name === "string" &&
    typeof b.quantity === "number" &&
    Number.isFinite(b.quantity)
  );
}


async function addProduct(req: Request, res: Response){
  if(!isBody(req.body)) return res.status(400).json({ "message": "bad request"}); 
  
  const { userId, name, quantity }: addProductBody = req.body; 

  try{
    const product = await createProduct({ userId, name, quantity }); 
  
    return res.status(201).json(product);
  }catch(error){
    console.log(`Error:${error}`);
    return res.sendStatus(500); 
  }
}

async function getOneProduct(req:Request, res:Response){ 
  if(!req.params?.id || typeof req.params.id !== "string") return res.sendStatus(400); 
  
  const productId  = req.params.id;

  try{
    const product = await readOneProduct(productId);
    
    return res.status(200).json(product); 
  }catch(error){
    console.log(`Error:${error}`); 
    return res.sendStatus(500); 
  }
}

async function changeProduct(req: Request ,res: Response){
  if(!req.params?.id || typeof req.params.id !== "string") return res.sendStatus(400); 

  const { name, quantity }: changeProductBody  = req.body;
  if(typeof name !== "string" || typeof quantity !== "number" || !Number.isFinite(quantity)) {
    return res.sendStatus(400);
  }

  const productId = req.params.id; 
  
  try{
    const product = await updateProduct(productId, {name, quantity}); 
    
    return res.send(200).json(product); 
  }catch(error){
    console.log(error); 
    return res.sendStatus(500); 
  }
}

async function removeOneProduct(req:Request, res: Response){
  if(!req.params.id || typeof req.params.id !== "string") return res.sendStatus(400);
  const productId = req.params.id;

  try{
    const deletedProduct = await deleteOneProduct(productId); 
    
    return res.status(200).json(deletedProduct); 
  }catch(error){
    console.log(error); 
    return res.sendStatus(500); 
  }
}

export{
  addProduct,
  getOneProduct, 
  changeProduct, 
  removeOneProduct
}