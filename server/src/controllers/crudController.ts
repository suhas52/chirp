import type { Request, Response, NextFunction } from 'express'
import { CustomError } from '../lib/customError.ts';

import { successResponse } from '../lib/response.ts';
import * as jwtService from '../services/jwtService.ts'
import * as crudService from '../services/crudService.ts'

export const postPostController = async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const accessToken = req.cookies.token;
    const decodedUser = jwtService.validateJwt(accessToken, next);
    if (!accessToken) throw next(new CustomError("User not logged in", 401))
    if (!formData) throw next(new CustomError("Invalid input", 400))
    const newPost = await crudService.postPostService(decodedUser.id, formData, next)
    return successResponse(res, 201, newPost);
}

export const getAllPostsController = async (req: Request, res: Response) => {

    const posts = await crudService.getAllPostsService();
    return successResponse(res, 200, posts)
}


export const getPostByPostIdController = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!postId) return next(new CustomError("Invalid input", 400))
    const post = await crudService.getPostByPostIdService(postId, next)
    return successResponse(res, 200, post)
}

export const getPostsByUserIdController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) return next(new CustomError("Invalid request", 400))
    const posts = await crudService.getPostsByUserIdService(userId, next)
    return successResponse(res, 200, posts)
}

export const postCommentByPostIdController = async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const { postId } = req.params;
    const accessToken = req.cookies.token;
    if (!postId) return next(new CustomError("Invalid Request", 400))
    if (!accessToken) return next(new CustomError("You cannot comment without being logged in", 400));
    if (!formData) return next(new CustomError("Unable to post an empty form", 400))
    const decodedUser = jwtService.validateJwt(accessToken, next);
    const newComment = await crudService.postCommentByPostIdService(decodedUser.id, postId, formData, next)
    return successResponse(res, 201, newComment)
}

export const getCommentsByPostIdController = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) return next(new CustomError("Invalid request", 400))
    const comments = crudService.getCommentsByPostIdService(postId, next)
    return successResponse(res, 200, comments)
}