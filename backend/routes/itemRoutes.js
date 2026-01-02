import express from "express";
import { createItem, getItemBySKU, getItems } from "../controllers/itemController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/items", authenticate, isAdmin, createItem);
router.get("/items", authenticate, isAdmin, getItems);

router.get("/items/:itemSKU", getItemBySKU);

export default router;