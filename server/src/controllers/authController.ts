import type { NextFunction, Request, Response } from "express";
import { loginSchema, profileSchema, registerSchema } from "../zodSchemas/authSchemas.ts";
import bcrypt from 'bcryptjs'
import { CustomError } from "../lib/customError.ts";
import { prisma } from "../lib/prismaConfig.ts";
import { successResponse } from "../lib/response.ts";
import envConf from "../lib/envConfig.ts";
import jwt from 'jsonwebtoken'


import * as authService from '../services/authService.ts'
import * as jwtService from "../services/jwtService.ts";

const salt = envConf.SALT;
const jwtSecret = envConf.JWT_SECRET;



interface DecodedUser {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body
    const newUser = await authService.register(formData)
    return successResponse(res, 201, newUser)
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const user = await authService.login(formData, next)
    const accessToken = jwtService.signJwt({ username: user.username, id: user.id })
    res.status(200).cookie("token", accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({
        success: true,
        data: { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName }
    })
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) return next(new CustomError("User not logged in", 401))
    successResponse(res.clearCookie("token"), 200)
}

export const meController = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) return next(new CustomError("User not logged in", 401))
    const accessToken = req.cookies.token;
    const decodedUser = jwtService.validateJwt(accessToken, next);
    const user = await authService.meService(decodedUser.id, next)
    return successResponse(res, 200, { ...user })
}

export const profileController = async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    if (!req.cookies.token) return next(new CustomError("User not logged in", 401))
    const accessToken = req.cookies.token;
    if (!formData) return next(new CustomError("Invalid input", 400))
    const decodedUser = jwtService.validateJwt(accessToken, next)
    const modifiedUser = await authService.updateProfileService(decodedUser.id, formData, next)
    return successResponse(res, 204, modifiedUser)
}

export const updateAvatarController = async (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;
    if (!image) return next(new CustomError("Image not provided", 400))
    if (!req.cookies.token) return next(new CustomError("User not logged in", 401))
    const accessToken = req.cookies.token;
    const decodedUser = jwtService.validateJwt(accessToken, next);
    const updatedAvatarFileName = await authService.updateAvatarService(image, decodedUser.id, next)
    return successResponse(res, 200, { updatedAvatarFileName })
}