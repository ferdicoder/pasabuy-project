import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import type { Application } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/connectDB.js';

import userRouter from './routers/userRouter.js';
import reqListRouter from './routers/reqListRouter.js';
import tripRouter from './routers/tripRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


async function startServer() {
  try {
    await connectDB();

    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/request', reqListRouter);
    app.use('/api/v1/trips', tripRouter);

    if (fs.existsSync(frontendDist)) {
      app.use(express.static(frontendDist));

      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();