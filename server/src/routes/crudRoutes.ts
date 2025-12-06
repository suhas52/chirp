
import { Router, type NextFunction, type Request, type Response } from "express";
import jwt from 'jsonwebtoken';
import { failureResponse, successResponse } from "../lib/response.ts";
import { profanity, CensorType } from '@2toad/profanity';
import { postSchema } from "../zodSchemas/crudSchemas.ts";
import { prisma } from "../lib/prismaConfig.ts";
import { CustomError } from "../lib/customError.ts";

interface DecodedUser {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

export const userRouter = Router();

userRouter.post("/post", async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const accessToken = req.cookies.token;

    if (!accessToken) return next(new CustomError("User not logged in", 401))
    if (!formData) return next(new CustomError("Invalid input", 400))
    if (profanity.exists(formData.content)) return next(new CustomError("Profanity is not allowed", 400))
    const inputValidation = postSchema.safeParse(formData)
    if (!inputValidation.success) next(new CustomError("Invalid input", 400))
    const decodedUser = jwt.decode(accessToken) as DecodedUser;
    const newPost = await prisma.post.create({
        data: {
            userId: decodedUser.id, ...formData
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true
        }
    })
    return successResponse(res, 201, newPost);
})

userRouter.get("/posts", async (req: Request, res: Response) => {

    const posts = await prisma.post.findMany({
        // todo: pagination
    })
    return successResponse(res, 200, posts)
})

userRouter.get("/post/:postId", async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!postId) return next(new CustomError("Invalid input", 400))
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    return successResponse(res, 200, post)
})



userRouter.get("/posts/:userId", async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) return next(new CustomError("Invalid request", 400))
    const posts = await prisma.post.findMany({
        where: {
            userId: userId
        }
    })
    return successResponse(res, 200, posts)
})

userRouter.post("/comment/:postId", async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const { postId } = req.params;
    const accessToken = req.cookies.token;
    if (!postId) return next(new CustomError("Invalid Request", 400))
    if (!accessToken) return next(new CustomError("You cannot comment without being logged in", 400));
    if (!formData) return next(new CustomError("Unable to post an empty form", 400))
    if (profanity.exists(formData.content)) return next(new CustomError("Profanity is not allowed", 400))
    const decodedUser = jwt.decode(accessToken) as DecodedUser;
    const newComment = await prisma.comment.create({
        data: {
            userId: decodedUser.id,
            postId: postId,
            content: formData.content
        }
    })
    return successResponse(res, 201, newComment)
})

userRouter.get("/comments/:postId", async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) return next(new CustomError("Invalid request", 400))
    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        },
    })
    return successResponse(res, 200, comments)
})

