import { Router } from "express";
import { getRecipeSuggestion } from "../controllers/aiController";



const router = Router();

router.get("/recipe-suggestion", getRecipeSuggestion);

export default router;