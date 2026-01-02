import express from "express";
import { createProduct, deleteProduct, updateProductField, getProductsByCategory, getProductByItemNumber, getProducts } from "../controllers/productController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/products", authenticate, isAdmin, createProduct);
router.get("/products", authenticate, isAdmin, getProducts);

router.patch("/products/:id/update-field", authenticate, isAdmin, updateProductField);
router.delete("/products/:id", authenticate, isAdmin, deleteProduct);
router.get("/products/:categoryId", getProductsByCategory);
router.get("/product/:itemNumber", getProductByItemNumber);

// router.get("/products", searchProducts);

export default router;