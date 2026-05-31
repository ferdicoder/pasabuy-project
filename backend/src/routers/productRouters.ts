import { Router } from "express";

import { 
  addProduct,
  getOneProduct, 
  changeProduct, 
  removeOneProduct
 } from "../controllers/productsController";


const productRouter = Router(); 

productRouter
  .post('/', addProduct)
  .get('/:id', getOneProduct)
  .patch('/:id', changeProduct)
  .delete('/:id', removeOneProduct)

export default productRouter;