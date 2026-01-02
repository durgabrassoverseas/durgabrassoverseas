import Finish from "../models/FinishSchema.js";

export const createFinish = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name } = req.body;
    console.log("Received finish name:", name);
    const existingFinish = await Finish.findOne({ name });
    if (existingFinish) {
      return res.status(400).json({ message: "Finish already exists" });
    }
    const finish = new Finish({ name });
    await finish.save();
    res.status(201).json(finish);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getFinishes = async (req, res) => {
  try {
    const finishes = await Finish.find();
    res.status(200).json(finishes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteFinish = async (req, res) => {
  try {
    const { id } = req.params;
    await Finish.findByIdAndDelete(id);
    res.status(200).json({ message: "Finish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

