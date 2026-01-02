import mongoose from "mongoose";

const finishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Finish ||
  mongoose.model("Finish", finishSchema);