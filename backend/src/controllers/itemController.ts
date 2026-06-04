import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { itemService } from "../services/itemService";
import { AppError } from "../middleware/errorHandler";
import { VALID_UNITS } from "../types/index";
import { success } from "zod/v4";

const itemSchema = z.object({
    name: z.string().min(1, "食材名は必須です").max(100, "100文字以内で入力してください"),
    categoryId: z.number().int().positive("カテゴリは必須です"),
    quantity: z.number().min(0, "0以上の値を入力してください"),
    unit: z.enum(VALID_UNITS, { errorMap: () => ({ message: "正しい単位を選択してください" }) }),
    minimumQuantity: z.number().min(0).optional(),//optional 意味：　任意　必須ではない
    expirationDate: z.string().datetime().optional(),
});

const itemUpdateSchema = itemSchema.partial(); //すべてのフィールドを任意にする

export const itemController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = req.query.categoryId ? Number(req.query.cagegoryId) : undefined;
            const items = await itemService.findAll(categoryId);
            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    },

    async getLowStock(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await itemService.findLowStock();
            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    },

    async getExpiring(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await itemService.findExpiring();
            res.json({ success: true, data: items });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id) //検索、並び替えはquery　　　 必須はparams特定するためにつかう
            const item = await itemService.findById(id);

            if (!item) {
                throw new AppError(404, "食材が見つからないよ！")
            }

            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = itemSchema.parse(req.body); //parseはバリテーション、型変換、例外処理をしてくれる
            const data = {
                ...validated,
                expirationDate: validated.expirationDate ? new Date(validated.expirationDate) : undefined,
            };
            const item = await itemService.create(data);
            res.status(201).json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const validated = itemUpdateSchema.parse(req.body);

            const exsitin = await itemService.findById(id);
            if (!exsitin) {
                throw new AppError(404, "食材が見つかりません");
            }

            const data = {
                ...validated,
                expirationDate: validated.expirationDate ? new Date(validated.expirationDate) : undefined,
            };
            const item = await itemService.update(id, data);
            res.json({ success: true, data: item });
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const existing = await itemService.findById(id);
            if (!existing) {
                throw new AppError(404, "食材が見つかりません");
            }

            await itemService.delete(id);
            res.json({ success: true, message: "削除完了しました" });
        } catch (error) {
            next(error);
        }
    },
};