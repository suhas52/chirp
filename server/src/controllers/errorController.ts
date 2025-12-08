import type { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
    statusCode?: number;
    status?: string;
}

export const globalErrorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    res.status(error.statusCode).json({
        success: false,
        status: error.statusCode,
        message: error.message,
    });
};