import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    length: String,
    width: String,
    height: String,
  },
  { _id: false } // optional: prevents extra _id for each size
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemNumber: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  // productSKU: { type: String, unique: true }, // SKU for the model, not the piece
  imageURL:{ type: String },

  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  // 🔥 ARRAY of item sizes
    itemSize: {
      type: [sizeSchema],
      default: [],
    },
  masterPack: String,
  cartonSize: {length: String, width: String, height: String},
  weight: String,
  // finish: { type: mongoose.Schema.Types.ObjectId, ref: "Finish" },
  finish: { type:String },
  otherMaterial: {type: [String]},
  price: { type: Number, required: true }, // base price
  discountPercent: Number, // discount percentage

}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);