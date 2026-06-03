import express from 'express';
import type { Application } from 'express';
import 'dotenv/config'

import { connectDB } from './config/connectDB'; 
import productRouter from './routers/productRouters';
import userRouter from './routers/userRouter';

const app: Application = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });

    app.use(`/api/v1/products`, productRouter); 
    app.use('/api/v1/users', userRouter); 
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();