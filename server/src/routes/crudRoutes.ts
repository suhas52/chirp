import { configDotenv } from "dotenv";
import { Router, type Request, type Response } from "express";
import jwt from 'jsonwebtoken';

configDotenv();


export const userRouter = Router();

userRouter.post("/post", async (req: Request, res: Response) => {

})

userRouter.get("/post/:userId", async (req: Request, res: Response) => {

})

userRouter.get("/posts", async (req: Request, res: Response) => {

})

userRouter.post("/comment/:postId", async (req: Request, res: Response) => {

})

userRouter.get("/comments/:postId", async (req: Request, res: Response) => {

})