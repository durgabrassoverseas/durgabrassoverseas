import express from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/categories", authenticate, isAdmin, createCategory);
router.get("/categories", authenticate, isAdmin, getCategories);
router.delete("/categories/:id", authenticate, isAdmin, deleteCategory);

export default router;