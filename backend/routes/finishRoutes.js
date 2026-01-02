import express from "express";
import { createFinish, deleteFinish, getFinishes } from "../controllers/finishController.js";

const router = express.Router();

router.post("/finish", createFinish);
router.get("/finish", getFinishes);
router.delete("/finish/:id", deleteFinish);

export default router;