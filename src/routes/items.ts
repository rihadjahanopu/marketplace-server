import { Router } from "express";
import {
	createItem,
	deleteItem,
	getCategories,
	getItemById,
	getItems,
	getMyItems,
	getStats,
	updateItem,
	addReview,
	getReviews,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/stats", getStats);
router.get("/my-items", authMiddleware, getMyItems);
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", authMiddleware, createItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

// Reviews
router.post("/:id/reviews", authMiddleware, addReview);
router.get("/:id/reviews", getReviews);

export default router;
