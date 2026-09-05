import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import type { Application } from 'express';

import { connectDB } from './config/connectDB.js';
import { toNodeHandler } from "better-auth/node";

import { auth } from './config/auth.js';
import userRouter from './routers/userRouter.js';
import reqListRouter from './routers/reqListRouter.js';
import tripRouter from './routers/tripRouter.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    service: 'pasabuy-backend',
    status: 'ok',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});


async function startServer() {
  try {
    await connectDB();

    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/request', reqListRouter);
    app.use('/api/v1/trips', tripRouter);

    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();