import express from "express";
import { createItem, getItemBySKU, getItems } from "../controllers/itemController.js";

const router = express.Router();

router.post("/items", createItem);
router.get("/items", getItems);

router.get("/items/:itemSKU", getItemBySKU);

export default router;