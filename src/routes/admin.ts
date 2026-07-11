import { Router } from "express";
import {
	deleteUser,
	getUsers,
	updateUserRole,
	getAllItems,
	adminDeleteItem,
} from "../controllers/adminController.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = Router();

// All routes here require both authentication and admin role
router.use(authMiddleware, isAdmin);

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Admin item management
router.get("/items", getAllItems);
router.delete("/items/:id", adminDeleteItem);

export default router;
