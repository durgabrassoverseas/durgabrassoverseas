import express from "express";
import { createFinish, deleteFinish, getFinishes } from "../controllers/finishController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/finish", authenticate, isAdmin, createFinish);
router.get("/finish", authenticate, isAdmin, getFinishes);
router.delete("/finish/:id", authenticate, isAdmin, deleteFinish);

export default router;