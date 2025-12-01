import { Router } from "express";
import { prisma } from '../generated/prisma/prisma.ts';
import { failureResponse, successResponse } from "../lib/response.ts";
export const authRouter = Router();

authRouter.get("/test", async (req, res) => {
    const test = await prisma.user.create({
        data: {
            firstName: "Suhas",
            lastName: "Hegade",
            passwordHash: "wioanfoawinfoniaw",
            username: "suhas9980",
        }
    })
    console.log(test)
    res.status(200).send("test")
})

