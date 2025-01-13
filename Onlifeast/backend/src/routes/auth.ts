import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controller/authController";


const authRouter = express.Router();


authRouter
    .post('/register', async (req: Request, res: Response) => {
        registerUser(req, res)
    })
    .post('/login', (req: Request, res: Response) => {
        loginUser(req, res);
    });


export default authRouter;
