import { NextFunction, Response, Request } from "express";
import { suggestRecipes } from "../services/aiService";


export async function getRecipeSuggestion(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await suggestRecipes();
        res.json({ "success": true, "data": { "recipes": data } })
    } catch (error) {
        next(error);
    }

}