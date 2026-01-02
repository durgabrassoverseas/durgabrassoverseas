import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory } from "../redux/slices/adminSlice";
import { toast } from "react-hot-toast";
// Import icons for a modern look
import { Plus, List, Loader2, Package, Tag } from 'lucide-react';

/**
 * Modern Category Tile Component
 */
const CategoryTile = ({ category }) => {
    // Note: Assuming category might have a count field (e.g., productCount)
    const productCount = category.productCount || Math.floor(Math.random() * 50); // Using random for demo

    return (
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 shrink-0">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                        {category.name}
                    </h3>
                    {/* <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        {productCount} Products
                    </p> */}
                </div>
            </div>
            {/* Action/Detail button (e.g., view details) */}
            {/* <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                View
            </button> */}
        </div>
    );
};

/**
 * Modern and Clean Category Page
 */
const CategoryPage = () => {
    const dispatch = useDispatch();
    const { categories = [], loading, error } = useSelector((state) => state.admin) || {};

    const [categoryName, setCategoryName] = useState("");
    const [creating, setCreating] = useState(false);

    // Effect for error notification
    useEffect(() => {
        if (error) {
            toast.error(error.message || String(error));
        }
    }, [error]);

    // Effect for fetching initial data
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        const trimmedName = categoryName.trim();
        if (!trimmedName) {
            toast.error("Category name cannot be empty.");
            return;
        }

        try {
            setCreating(true);
            const token = localStorage.getItem("token"); // Assuming token is needed
            await dispatch(createCategory({ name: trimmedName, token })).unwrap();
            setCategoryName("");
            toast.success(`Category "${trimmedName}" created successfully!`);
            // Refetch to ensure the list is current (good practice after mutation)
            dispatch(fetchCategories()); 
        } catch (err) {
            toast.error(err.message || "Failed to create category. Maybe it already exists?");
            console.error("Creation Error:", err);
        } finally {
            setCreating(false);
        }
    };

    // --- Loading State ---
    if (loading && categories.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <span className="mt-4 text-xl font-medium text-gray-700">Loading categories...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- Header and Summary --- */}
                <header className="pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center space-x-3">
                        <List className="w-8 h-8 text-indigo-600" />
                        <span>Product Categories</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Organize your products for better inventory management and filtering.
                    </p>
                    <div className="mt-4 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full inline-block">
                        {categories.length} Total Categories
                    </div>
                </header>

                {/* --- Main Content Area: Split Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Create Category Form (Sticky/Prominent) */}
                    <div className="lg:col-span-1">
                        <form
                            onSubmit={handleCreateCategory}
                            // Enhanced form card style
                            className="bg-white p-8 rounded-3xl shadow-2xl space-y-6 sticky top-8 border border-indigo-200/50"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 border-b pb-3 text-indigo-700">
                                <Plus className="w-6 h-6" />
                                <span>New Category</span>
                            </h2>
                            <p className="text-sm text-gray-500">
                                Create a top-level category for product grouping.
                            </p>

                            <div>
                                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g. Smart Devices"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition focus:outline-none text-gray-800 shadow-sm"
                                    disabled={creating}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating || categoryName.trim() === ""}
                                // Enhanced button style
                                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:-translate-y-0.5"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        <span>Add Category</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Category List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                             All Categories
                        </h2>
                        
                        {categories.length === 0 && !loading ? (
                            <div className="text-center p-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                                <Package className="w-12 h-12 mx-auto text-gray-300" />
                                <p className="mt-4 text-xl font-semibold text-gray-700">No Categories Defined</p>
                                <p className="mt-1 text-gray-500">Start by creating a new one on the left.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map((category) => (
                                    <CategoryTile
                                        key={category._id}
                                        category={category}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;