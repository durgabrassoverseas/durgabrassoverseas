import Category from "../models/CategorySchema.js";
import Product from "../models/ProductSchema.js";
import Finish from "../models/FinishSchema.js";

// Controller to get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalFinishes = await Finish.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalCategories,
                totalProducts,
                totalFinishes
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};