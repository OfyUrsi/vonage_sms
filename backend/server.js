import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import verifyRoutes from './routes/verify.js';

dotenv.config();
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // <-- Allow frontend origin
    methods: ['GET', 'POST'],
    credentials: true, // Optional: if you use cookies or sessions
  })
);
app.use(express.json());
app.use('/api', verifyRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
