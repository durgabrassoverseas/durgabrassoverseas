import express from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/categories", createCategory);
router.get("/categories", getCategories);
router.delete("/categories/:id", deleteCategory);

export default router;