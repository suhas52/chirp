import { profanity } from '@2toad/profanity';
import { prisma } from "../lib/prismaConfig.ts";
import { CustomError } from "../lib/customError.ts";
import * as types from '../lib/types.ts'
import { decodeCursor, encodeCursor } from "../lib/encodeCursor.ts";
import type z from 'zod';
import type { postSchema } from '../zodSchemas/userSchemas.ts';


export const postPostService = async (id: string, formData: z.infer<typeof postSchema>) => {
    if (profanity.exists(formData.content)) throw new CustomError("Profanity is not allowed", 400)
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

export const getAllPostsService = async (take: number, cursor?: string) => {
    let query: types.PostQuery = {
        take: take + 1,
        orderBy: { cursorId: 'asc' },
    }


    if (cursor) {
        const decodedCursor = decodeCursor(cursor)
        query.cursor = { cursorId: decodedCursor }
    }

    const posts = await prisma.post.findMany(query)
    let nextCursor = null;
    if (posts.length > take) {
        const nextItem = posts.pop();
        nextCursor = nextItem && encodeCursor(nextItem.cursorId);
    }

    return { posts, nextCursor }


}

export const getPostByPostIdService = async (postId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    return post
}

export const getPostsByUserIdService = async (userId: string, take: number, cursor?: string) => {
    const query: types.PostQuery = {
        orderBy: { cursorId: 'asc' },
        take: take + 1,
        where: { userId: userId }
    }

    if (cursor) {
        const decodedCursor = decodeCursor(cursor)
        query.cursor = { cursorId: decodedCursor }
    }


    const posts = await prisma.post.findMany(query)
    if (posts.length === 0) throw new CustomError("This user either does not exist or does not have any posts", 400)
    let nextCursor = null;
    if (posts.length > take) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.cursorId
    }

    return { posts, nextCursor }
}

export const postCommentByPostIdService = async (userId: string, postId: string, formData: z.infer<typeof postSchema>) => {
    const { content } = formData;
    if (profanity.exists(formData.content)) throw new CustomError("Profanity is not allowed", 400)
    const newComment = await prisma.comment.create({
        data: {
            userId,
            postId,
            content
        }
    })
    return newComment;
}

export const getCommentsByPostIdService = async (postId: string, take: number, cursor?: string) => {
    let query: types.CommentQuery = {
        orderBy: { cursorId: 'asc' },
        take: take + 1,
        where: { postId: postId }
    }

    if (cursor) {
        const decodedCursor = decodeCursor(cursor)
        query.cursor = { cursorId: decodedCursor }
    }

    const comments = await prisma.comment.findMany(query)
    let nextCursor = null;
    if (comments.length > take) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.cursorId;
    }

    return { comments, nextCursor }
}