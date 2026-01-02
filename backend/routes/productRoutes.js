import express from "express";
import { createProduct, deleteProduct, updateProductField, getProductsByCategory, getProductByItemNumber, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);

router.patch("/products/:id/update-field", updateProductField);
router.delete("/products/:id", deleteProduct);

router.get("/products/:categoryId", getProductsByCategory);
router.get("/product/:itemNumber", getProductByItemNumber);

// router.get("/products", searchProducts);

export default router;