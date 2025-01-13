import cors from "cors";
import express from "express";
import passport from "passport";
import authRouter from "./routes/auth";
import foodRouter from "./routes/foodRoutes";
import orderRouter from "./routes/orderRoutes";
import { authenticate } from "./middleware/authMiddleware";


const app = express()


app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/food',authenticate, foodRouter);
app.use('/orders', authenticate, orderRouter);

export default app