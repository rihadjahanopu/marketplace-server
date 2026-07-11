import { Router } from "express";
import {
	createItem,
	deleteItem,
	getCategories,
	getItemById,
	getItems,
	getMyItems,
	getStats,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/stats", getStats);
router.get("/my-items", authMiddleware, getMyItems);
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", authMiddleware, createItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
