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

const Spec = ({ label, value, IconComponent, isList = false }) => (
    <div className="flex items-start space-x-2 p-2.5 bg-gray-50 rounded-lg">
        <IconComponent className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
            <span className="block text-xs font-medium text-gray-500">{label}</span>
            {isList && Array.isArray(value) && value.length > 0 ? (
                <ul className="mt-1 space-y-0.5">
                    {value.map((item, index) => (
                        <li key={index} className="text-base font-semibold text-gray-900 flex items-start">
                            <span className="mr-1.5">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="block text-base font-semibold text-gray-900 truncate">
                    {value || "-"}
                </span>
            )}
        </div>
    </div>
);

const UserItemPage = () => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { itemNumber } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.user);

    const timerRef = useRef(null);

    const handlePressStart = () => {
        timerRef.current = setTimeout(() => {
            setShowDiscount(true);
        }, 1000);
    };

    const handlePressEnd = () => {
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
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="ml-3 text-lg font-medium text-gray-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 m-4 sm:m-8 max-w-lg mx-auto bg-red-50 rounded-xl shadow border border-red-300">
                <p className="text-red-700 font-semibold text-base mb-2">Error Loading Data</p>
                <p className="text-sm">{error.message || String(error)}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-4 m-4 sm:m-8 max-w-lg mx-auto bg-yellow-50 rounded-xl shadow border border-yellow-300">
                <p className="text-yellow-700 font-semibold text-base">Item Not Found</p>
                <p className="text-sm mt-1">Could not retrieve details for Item: {itemNumber}</p>
            </div>
        );
    }

    const status = product.status || 'available';
    const StatusIcon = status === 'available' ? CheckCircle : XOctagon;
    const statusColor = status === 'available' ? 'text-green-600 bg-green-100 border-green-300' : 'text-red-600 bg-red-100 border-red-300';

    return (
        <div className="min-h-screen bg-gray-50 overflow-y-auto sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl overflow-hidden">
                <div className="p-4 md:p-6 lg:p-10 space-y-3 md:space-y-4">

                    {/* HEADER SECTION - Responsive */}
                    <div className="flex items-start justify-between gap-3 pb-3 lg:pb-4 border-b">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold md:font-extrabold text-gray-900 leading-tight mb-1 truncate">
                                {product.name}
                            </h1>
                            
                            <p className="text-sm text-gray-500 flex items-center gap-1 font-mono mb-0.5">
                                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400 shrink-0" />
                                <span className="font-semibold">Item:</span> 
                                <span className="truncate">{product.itemNumber}</span>
                            </p>

                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Grid className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                <span className="truncate">{product.category?.name || 'Uncategorized'}</span>
                            </p>
                        </div>

                        {/* PRODUCT IMAGE - Responsive sizing */}
                        <div
                            className="w-24 h-24 md:w-32 md:h-28 lg:w-34 lg:h-28 rounded-lg md:rounded-xl overflow-hidden border bg-gray-50 cursor-zoom-in shrink-0 hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(product.imageURL || demoImg)}
                        >
                            <img
                                src={product.imageURL}
                                alt={product.name}
                                className="w-full h-full object-cover md:object-fit"
                            />
                        </div>
                    </div>

                    {/* DESCRIPTION - Responsive truncation */}
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Description</h2>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-3 md:line-clamp-none">
                            {product.description || "No detailed overview provided."}
                        </p>
                    </div>

                    {/* SPECIFICATIONS - Responsive grid */}
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">Specifications</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                            <Spec label="Finish" value={product.finish} IconComponent={Info} />
                            <Spec label="Weight" value={`${product.weight} kg`} IconComponent={Weight} />
                            <Spec label="Item Size" value={itemSize} IconComponent={Ruler} />
                            <Spec label="Pack Qty" value={product.masterPack} IconComponent={Layers} />
                            <div className="col-span-2">
                                <Spec 
                                    label="Other Materials" 
                                    value={product.otherMaterial} 
                                    IconComponent={Grid} 
                                    isList={true}
                                />
                            </div>
                            <div className="col-span-2">
                                <Spec label="Carton Size" value={cartonSize} IconComponent={Truck} />
                            </div>
                        </div>
                    </div>

                    {/* PRICE SECTION - Moved to bottom */}
                    <div
                        className={`flex items-center justify-center p-3.5 md:p-4 rounded-xl border transition-all duration-500 select-none cursor-pointer
                        ${showDiscount ? 'bg-green-50 border-green-300' : 'bg-indigo-50 border-indigo-300'}`}
                        onMouseDown={handlePressStart}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={handlePressStart}
                        onTouchEnd={handlePressEnd}
                    >
                        {!showDiscount ? (
                            <p className="text-4xl md:text-3xl font-extrabold text-indigo-700">
                                ${originalPrice}
                            </p>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 animate-in fade-in duration-300">
                                <p className="text-4xl md:text-3xl font-extrabold text-green-700">
                                    ${discountedPrice}
                                </p>
                                <div className="flex flex-col md:items-start items-center">
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
                    {/* TIMESTAMPS - Minimal */}
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-400 space-y-0.5">
                        <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                
            </div>

            

            {/* IMAGE MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 md:top-6 right-4 md:right-6 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <XOctagon className="w-8 h-8 md:w-10 md:h-10" />
                    </button>

                    <div className="max-w-full md:max-w-5xl max-h-[85vh] md:max-h-[90vh]">
                        <img
                            src={selectedImage}
                            alt="Enlarged product"
                            className="rounded-lg shadow-2xl max-w-full max-h-[80vh] md:max-h-[85vh] object-contain"
                        />
                        <p className="text-white text-center mt-3 md:mt-4 font-medium text-base">{product.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserItemPage;
