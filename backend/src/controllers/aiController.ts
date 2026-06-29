import { NextFunction, Response, Request } from "express";
import { suggestRecipes } from "../services/aiService";
import { register, login } from "../services/authService";
import { AppError } from "../middleware/errorHandler";
export async function getRecipeSuggestion(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await suggestRecipes();
        res.json({ "success": true, "data": { "recipes": data } })
    } catch (error) {
        next(error);
    }

}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body
        const token = await authService.register(data.email, data.password)
        return res.json({ success: true, data: { token } })
    } catch {
        throw new AppError(401, "エラーが発生しました。");
    }
}

