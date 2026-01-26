import express from "express";
import { createProduct, deleteProduct, updateProductField, getProductsByCategory, getProductByItemNumber, getProducts, getProductByProductId } from "../controllers/productController.js";
import { authenticate, isAdmin, isAdminOrStaff } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/products", authenticate, isAdminOrStaff, createProduct);
router.get("/products", authenticate, isAdminOrStaff, getProducts);

router.patch("/products/:id/update-field", authenticate, isAdminOrStaff, updateProductField);
router.delete("/products/:id", authenticate, isAdmin, deleteProduct);
router.get("/products/:categoryId", getProductsByCategory);
router.get("/product/:itemNumber", getProductByItemNumber);
router.get("/product/id/:productId", authenticate, isAdmin, getProductByProductId);

// router.get("/products", searchProducts);

export default router;