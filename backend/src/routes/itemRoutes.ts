import { Router } from "express";
import { itemController } from "../controllers/itemController";

const router = Router();

router.get("/low-stock", itemController.getLowStock);
router.get("/expiring", itemController.getExpiring);

router.get("/", itemController.getAll);
router.get("/:id", itemController.getById);
router.post("/", itemController.create);
router.put("/:id", itemController.update);
router.delete("/", itemController.delete);

export default router;