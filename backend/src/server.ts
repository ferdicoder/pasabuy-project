import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import type { Application } from 'express';


import { connectDB } from './config/connectDB'; 

import userRouter from './routers/userRouter';
import reqListRouter  from './routers/reqListRouter';
import tripRouter from './routers/tripRouter';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });

    app.use('/api/v1/users', userRouter); 
    app.use('/api/v1/request', reqListRouter); 
    app.use('/api/v1/trips', tripRouter);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();