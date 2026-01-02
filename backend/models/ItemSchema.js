import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  itemSKU: { type: String, unique: true }, 
  qrCode: String,
  
  // status: {
  //   type: String,
  //   enum: ["in_stock", "sold", "damaged", "returned"],
  //   default: "in_stock",
  // },

  // serialNumber: String,

}, { timestamps: true });

export default mongoose.models.Item || mongoose.model("Item", itemSchema);