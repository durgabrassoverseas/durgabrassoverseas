import express from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";
import { authenticate, isAdmin, isAdminOrStaff } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/categories", authenticate, isAdminOrStaff, createCategory);
router.get("/categories", authenticate, isAdminOrStaff, getCategories);
router.delete("/categories/:id", authenticate, isAdmin, deleteCategory);

export default router;