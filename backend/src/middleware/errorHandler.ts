import { Request, Response, NextFunction } from "express";
import { success } from "zod";

export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    console.error(err);
    res.status(500).json({
        success: false,
        mesasge: "サーバエラーが発生しました。"
    });
}

