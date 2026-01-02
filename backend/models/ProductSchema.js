import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemNumber: { type: String, unique: true },
  slug: { type: String, unique: true },
  // productSKU: { type: String, unique: true }, // SKU for the model, not the piece
  imageURL:{ type: String },

  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  itemSize: {length: String, width: String, height: String},
  masterPack: String,
  cartonSize: {length: String, width: String, height: String},
  weight: String,
  finish: { type: mongoose.Schema.Types.ObjectId, ref: "Finish" },
  otherMaterial: String,
  price: { type: Number, required: true }, // base price
  discountPercent: Number, // discount percentage

}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);