import express from 'express';
import 'dotenv/config'

import { connectDB } from './config/connectDB'

const app = express();
const PORT = Number(process.env.SERVER_PORT ?? 5000);

app.use(express.json());





async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();