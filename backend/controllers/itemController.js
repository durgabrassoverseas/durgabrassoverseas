import Item from "../models/ItemSchema.js";
import Product from "../models/ProductSchema.js";
import { generateItemSKU, generateQR } from "../utils/helperFunctions.js";

export const createItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let items = [];

    for (let i = 0; i < quantity; i++) {
      const itemSKU = generateItemSKU();

      const qrText = `${process.env.FRONTEND_BASE_URL}/item/${product.productSKU}/${itemSKU}`;
      const qrCode = await generateQR(qrText);

      const item = await Item.create({
        product: productId,
        itemSKU,
        qrCode,
      });
      items.push(item);
    }

    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("product");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemBySKU = async (req, res) => {
  try {
    const { itemSKU } = req.params;
    console.log("Received itemSKU:", itemSKU);

    const item = await Item.findOne({ itemSKU }).populate({
      path: "product",
      populate: {
        path: "category", // 👈 nested populate
      },
    });

    console.log("Fetched item:", item);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Get item by SKU error:", err);
    res.status(500).json({ error: err.message });
  }
};
