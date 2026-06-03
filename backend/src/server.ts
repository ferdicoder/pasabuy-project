import express from 'express';
import type { Application } from 'express';
import 'dotenv/config'

import { connectDB } from './config/connectDB'; 

import userRouter from './routers/userRouter';
import reqListRouter  from './routers/reqListRouter';

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

    app.use('/api/v1/users', userRouter); 
    app.use('/api/v1/request', reqListRouter); 
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();