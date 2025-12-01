import { Router, type Request, type Response } from "express";
import { prisma } from '../generated/prisma/prisma.ts';
import { failureResponse, successResponse } from "../lib/response.ts";
import { registerSchema } from "../zodSchemas/authSchemas.ts";
export const authRouter = Router();
import bcrypt from 'bcryptjs';
import { configDotenv } from "dotenv";
configDotenv();
const SALT = Number(process.env.SALT) || 10;



authRouter.get("/test", (req: Request, res: Response) => {
    failureResponse(res, 400, "Invalid entry")
})

authRouter.post("/register", async (req: Request, res: Response) => {
    const formData = req.body
    const inputValidation = registerSchema.safeParse(formData);
    if (!inputValidation.success) {
        return failureResponse(res, 400, "Failed to validate input")
    }
    const passwordHash = await bcrypt.hash(formData.password, SALT)
    try {
        const newUser = await prisma.user.create({
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                passwordHash: passwordHash
            },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                createdAt: true
            }
        })
        return successResponse(res, 201, {...newUser})
    } catch (err) {
        return failureResponse(res, 401, "")
    }
})

authRouter.post("/login", async (req: Request, res: Response) => {
    const formData = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {username: formData.username}
        })
        if (!user) throw new Error("Invalid username")
        const passwordMatch = await bcrypt.compare(formData.password, user?.passwordHash)
        if (!passwordMatch) throw new Error("Wrong password")
        
    } catch (err: any) {
        failureResponse(res, 400, err.message)
    }
})