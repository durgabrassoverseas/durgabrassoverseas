import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductByItemNumber } from "../../redux/slices/userSlice";
import {
    Weight,
    Layers,
    Truck,
    CheckCircle,
    XOctagon,
    Info,
    Grid,
    Loader,
    Zap,
    Ruler
} from "lucide-react";
import demoImg from "../../assets/demoImg.png";

const Spec = ({ label, value, IconComponent }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <IconComponent className="w-5 h-5 text-indigo-500 shrink-0" />
        <div>
            <span className="block text-xs font-medium text-gray-500">{label}</span>
            <span className="block text-sm font-semibold text-gray-900 mt-0.5">
                {value || "-"}
            </span>
        </div>
    </div>
);

const UserItemPage = () => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { itemNumber } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.user);

    const timerRef = useRef(null); // To store the 2-second timer

    const handlePressStart = () => {
        // Start a timer for 2000ms (2 seconds)
        timerRef.current = setTimeout(() => {
            setShowDiscount(true);
        }, 1000);
    };

    const handlePressEnd = () => {
        // If they let go before 2 seconds, clear the timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setShowDiscount(false);
    };

    useEffect(() => {
        if (itemNumber) {
            dispatch(fetchProductByItemNumber(itemNumber));
        }
    }, [dispatch, itemNumber]);

    const itemSize = useMemo(() =>
        product?.itemSize ? `${product.itemSize.length}" × ${product.itemSize.width}" × ${product.itemSize.height}"` : 'N/A',
        [product?.itemSize]
    );

    const cartonSize = useMemo(() =>
        product?.cartonSize ? `${product.cartonSize.length}" × ${product.cartonSize.width}" × ${product.cartonSize.height}"` : 'N/A',
        [product?.cartonSize]
    );

    const originalPrice = product?.price || 0;
    const discountPercent = product?.discountPercent || 0;
    const discountedPrice = useMemo(() => {
        const discountAmount = (originalPrice * discountPercent) / 100;
        return (originalPrice - discountAmount).toFixed(2);
    }, [originalPrice, discountPercent]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="ml-3 text-lg text-gray-700">Loading item details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-8 max-w-lg mx-auto bg-red-50 rounded-xl shadow border border-red-300 mt-8">
                <p className="text-red-700 font-semibold mb-2">Error Loading Data</p>
                <p className="text-sm">{error.message || String(error)}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-4 sm:p-8 max-w-lg mx-auto bg-yellow-50 rounded-xl shadow border border-yellow-300 mt-8">
                <p className="text-yellow-700 font-semibold">Item Not Found</p>
                <p className="text-sm mt-1">Could not retrieve details for Item: {itemNumber}</p>
            </div>
        );
    }

    // FIX: Using product instead of item
    const status = product.status || 'available';
    const StatusIcon = status === 'available' ? CheckCircle : XOctagon;
    const statusColor = status === 'available' ? 'text-green-600 bg-green-100 border-green-300' : 'text-red-600 bg-red-100 border-red-300';

    return (
        <div className="min-h-screen bg-gray-50 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl overflow-hidden">
                <div className="p-6 md:p-10 space-y-4">

                    <div className="flex items-start justify-between border-b pb-2 lg:pb-4">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {product.name}
                            </h1>

                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 font-mono">
                                <Zap className="w-4 h-4 text-indigo-400" />
                                <span className="font-semibold">Item Number:</span> {product.itemNumber}
                            </p>

                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Grid className="w-4 h-4 text-gray-400" />
                                Category: {product.category?.name || 'Uncategorized'}
                            </p>
                        </div>

                        {/* PRODUCT IMAGE */}
                        <div
                            className="w-34 h-28 rounded-xl overflow-hidden border bg-gray-50 cursor-zoom-in hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(product.imageURL || demoImg)}
                        >
                            <img
                                src={product.imageURL}
                                alt={product.name}
                                className="w-full h-full object-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Product Description</h2>
                        <p className="mt-1 text-gray-700 leading-relaxed">
                            {product.description || "No detailed overview provided."}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* FIX: finish is an object, so we access .name */}
                            <Spec label="Finish" value={product.finish?.name} IconComponent={Info} />
                            <Spec label="Item Size (L×W×H)" value={itemSize} IconComponent={Ruler} />
                            <Spec label="Weight (kg)" value={product.weight} IconComponent={Weight} />
                            <Spec label="Other Material" value={product.otherMaterial} IconComponent={Grid} />
                            <Spec label="Master Pack Qty" value={product.masterPack} IconComponent={Layers} />
                            <Spec label="Carton Size (L×W×H)" value={cartonSize} IconComponent={Truck} />
                        </div>
                    </div>



                    {/* --- IMAGE MODAL OVERLAY --- */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
                                onClick={() => setSelectedImage(null)}
                            >
                                <XOctagon className="w-10 h-10" />
                            </button>

                            <div className="max-w-5xl max-h-[90vh] relative">
                                <img
                                    src={selectedImage}
                                    alt="Enlarged product"
                                    className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain"
                                />
                                <p className="text-white text-center mt-4 font-medium">{product.name}</p>
                            </div>
                        </div>
                    )}

                    <div
                        className={`flex flex-col sm:flex-row sm:items-center sm:space-x-6 p-4 rounded-xl border transition-all duration-500 select-none cursor-pointer
                ${showDiscount ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200'}`}
                        onMouseDown={handlePressStart}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={handlePressStart}
                        onTouchEnd={handlePressEnd}
                    >
                        {!showDiscount ? (
                            /* 1. DEFAULT: Show Original Price */
                            <p className="text-3xl font-extrabold text-indigo-700">
                                ${originalPrice}
                            </p>
                        ) : (
                            /* 2. AFTER 2 SECONDS: Show Discounted Price */
                            <div className="flex items-center gap-4 animate-in fade-in duration-300">
                                <p className="text-3xl font-extrabold text-green-700">
                                    ${discountedPrice}
                                </p>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-green-600">
                                        Discount: {discountPercent}%
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        Original ${originalPrice}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                        <p>Record Created: {new Date(product.createdAt).toLocaleString()}</p>
                        <p>Record Last Updated: {new Date(product.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserItemPage;