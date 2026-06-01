import { Request, Response, NextFunction } from "express";
import { success, z } from "zod";
import { categoryService } from "../services/categoryService";
import { AppError } from "../middleware/errorHandler";

const categorySchema = z.object({
    name: z.string().min(1, "カテゴリ名は必須です").max(50, "50文字以内で入力してください。"),
});


export const categoryController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.findAll();
            res.json({ success: true, data: categories });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const category = await categoryService.findById(id);

            if (!category) {
                throw new AppError(404, "カテゴリが見つかりません");
            }

            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = categorySchema.parse(req.body); //parse 意味：　分析する　、　schema　意味：ルール
            const category = await categoryService.create(validated.name);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id); //params = パラメータ
            const validated = categorySchema.parse(req.body);

            const existing = await categoryService.findById(id);
            if (!existing) {
                throw new AppError(404, "カテゴリが見つかりません");
            }

            const category = await categoryService.update(id, validated.name);
            res.json({ success: true, data: category });
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const existing = await categoryService.findById(id);
            if (!existing) {
                throw new AppError(404, "カテゴリが見つかりません");
            }
            await categoryService.delete(id);
            res.json({ success: true, message: "削除しました。" });
        } catch (error) {
            next(error);
        }
    },
};