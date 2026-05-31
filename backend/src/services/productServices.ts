import { nanoid } from 'nanoid';
import { sql } from '../config/query'; 

import type { addProductBody, changeProductBody } from '../interface/product.interface';


async function createProduct({ userId, name, quantity }: addProductBody){
  const query = `
    INSERT INTO products (product_id, user_id, name, quantity)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `
  const productId = nanoid(); 
  const val = [productId, userId, name, quantity]; 

  const newProduct = await sql(query, val); 
  if(!newProduct.rowCount) throw new Error("Product creation failed"); 
  
  return newProduct.rows[0]; 
}

async function readOneProduct(productId: string){
  const query = `
    SELECT * 
    FROM products
    WHERE product_id = $1
  `
  const val = [productId]; 
  
  const product = await sql(query, val); 
  if(!product.rowCount) throw new Error("Product Not Found");
  
  return product.rows[0]; 
}

async function updateProduct(productId: string,{name, quantity}: changeProductBody){
  await readOneProduct(productId); 
  
  const query = `
    UPDATE products
    SET name = $1, quantity = $2
    WHERE product_id = $3
  `
  const val = [name, quantity, productId]; 
  
  await sql(query, val); 
}

async function deleteOneProduct(productId: string){
  await readOneProduct(productId); 
  
  const query = `
    DELETE FROM products
    WHERE product_id = $1
    RETURNING * 
  `
  const val = [productId]; 

  const product = await sql(query, val); 
  return product.rows[0]; 
}

export{
  createProduct, 
  readOneProduct, 
  updateProduct, 
  deleteOneProduct
}