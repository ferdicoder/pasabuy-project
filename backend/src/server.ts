import express from 'express'; 
import 'dotenv/config'

import { createProduct } from './controllers/productsController'
import { getOneProduct } from './controllers/productsController'
import { getAllProducts } from './controllers/productsController'
import { editProduct } from './controllers/productsController'
import { removeProduct } from './controllers/productsController'

const app = express(); 
const PORT = process.env.PORT

app.use(express.json()); 

app.get('/products', getAllProducts);
app.get('/products/:id', getOneProduct);
app.post('/products', createProduct);
app.patch('/products/:id', editProduct);
app.delete('/products/:id', removeProduct);


app.listen(PORT, ()=>{
  console.log(`Server Running on PORT: ${PORT}`); 
}); 