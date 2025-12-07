import type { NextFunction } from "express"
import { profanity } from '@2toad/profanity';
import { prisma } from "../lib/prismaConfig.ts";
import { CustomError } from "../lib/customError.ts";


export const postPostService = async (id: string, formData: any, next: NextFunction) => {
    if (profanity.exists(formData.content)) throw next(new CustomError("Profanity is not allowed", 400))

    const newPost = await prisma.post.create({
        data: {
            userId: id, ...formData
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true
        }
    })
    return newPost;
}

export const getAllPostsService = async () => {
    return await prisma.post.findMany({
        // todo: pagination
    })
}

export const getPostByPostIdService = async (postId: string, next: NextFunction) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    return post
}

export const getPostsByUserIdService = async (userId: string, next: NextFunction) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId
        }
    })
    // pagination pending
    return posts
}

export const postCommentByPostIdService = async (userId: string, postId: string, formData: any, next: NextFunction) => {
    if (profanity.exists(formData.content)) return next(new CustomError("Profanity is not allowed", 400))
    const newComment = await prisma.comment.create({
        data: {
            userId: userId,
            postId: postId,
            content: formData.content
        }
    })
    return newComment;
}

export const getCommentsByPostIdService = async (postId: string, next: NextFunction) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        },
    })
    // pagination pending
    return comments
}