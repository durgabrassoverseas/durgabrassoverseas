import Product from "../models/ProductSchema.js";
import { generateSlug } from "../utils/helperFunctions.js";

export const createProduct = async (req, res) => {
  try {
    const { name, itemNumber, imageURL, description, category, itemSize, masterPack, cartonSize, weight, finish, otherMaterial, price, discountPercent } = req.body;

    if(!name || !category || !price) {
      return res.status(400).json({ error: "Name, Category and Price are required fields." });
    }

    const slug = generateSlug(name);

    const newProduct = new Product({
        name,
        itemNumber,
        slug,
        imageURL,
        description,
        category,
        itemSize,
        masterPack,
        cartonSize,
        weight,
        finish,
        otherMaterial,
        price,
        discountPercent,
    });

    // populate category and finish before sending response

    await newProduct.save();

    // 🔥 Populate category & finish for Redux
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("category", "name")   // or { path: "category", select: "name" }
      .populate("finish", "name");    // same here if finish is a ref

    res.json({ success: true, product: populatedProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProductField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (!field) {
      return res.status(400).json({ error: "Field name is required" });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "imageURL",
      "itemSize",
      "itemNumber",
      "masterPack",
      "cartonSize",
      "weight",
      "finish",
      "otherMaterial",
      "price",
      "discountPercent",
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }

    const updateData = { [field]: value };

    // Auto-update slug if name is edited
    if (field === "name") {
      updateData.slug = generateSlug(value);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("category").populate("finish");

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      success: true,
      message: `${field} updated successfully`,
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).populate("category").populate("finish");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductByItemNumber = async (req, res) => {
  try {
    const { itemNumber } = req.params;
    const product = await Product.findOne({ itemNumber }).populate("category").populate("finish");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getProducts = async (req, res) => {
  console.log("Search products called with query:", req.query);

  try {
    const {
      search = "",
      sort = "desc",   // asc | desc
      page = 1,
      limit = 100,
      category,        // categoryId OR "all"
    } = req.query;

    const filter = {};

    // 🔍 SEARCH (itemNumber, name, description)
    if (search) {
      filter.$or = [
        { itemNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🗂 Category
    if (category) {
      filter.category = category;
    }
    // 🔢 SORT
    const products = await Product.find(filter).populate("category").populate("finish")
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      sortBy: "itemNumber",
      sortOrder: sort,
    });
  } catch (err) {
    console.error("Search products error:", err);
    res.status(500).json({ error: err.message });
  }
};
