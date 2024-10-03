import express from 'express'
import connectDB from './config/db.js'
import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import cors from 'cors';
import orderRouter from './routes/orderRoutes.js';

const app = express();

connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

export default app;
