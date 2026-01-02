import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    Pencil, Check, X, Loader2, Package, Layers, PlusCircle, Factory,
    ChevronDown, ChevronUp, Scan, Globe, Tag, Warehouse, Box
} from "lucide-react";

// Assuming these actions are correctly exported from your adminSlice
import { fetchItems, fetchProducts, fetchCategories, createItem, updateProduct } from "../redux/slices/adminSlice";

/* ----------------------------------
HELPER: Currency Formatting
----------------------------------- */
const formatCurrency = (value) => {
    // Only format numbers that are not null/undefined/empty string
    if (value === null || value === undefined || value === "") return "—";
    const num = Number(value);
    if (isNaN(num)) return "—";
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

/* ----------------------------------
DATA: Product Fields
----------------------------------- */
const PRODUCT_FIELDS = [
    { label: "Name", field: "name" },
    { label: "Master Pack", field: "masterPack", icon: Box },
    { label: "Weight (kg)", field: "weight", icon: Tag },
    { label: "Finish", field: "finish", icon: Pencil },
    { label: "Other Material", field: "otherMaterial", icon: Tag },
    { label: "Price", field: "price", type: "number", format: formatCurrency, icon: Globe },
    { label: "Discount %", field: "discountPercent", type: "number", format: (val) => `${val}%`, icon: Tag },
];

/* ----------------------------------
COMPONENT: Editable Field
----------------------------------- */
const EditableField = ({ value, field, productId, type = "text", isReadOnly = false, format = (v) => v, Icon }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [editing, setEditing] = useState(false);
    // Use String(value) to handle null/undefined numbers being rendered as '0' in input
    const [localValue, setLocalValue] = useState(String(value ?? "")); 

    useEffect(() => {
        if (!editing) {
            setLocalValue(String(value ?? ""));
        }
    }, [value, editing]);

    const save = () => {
        if (isReadOnly) return;
        
        // Normalize for comparison
        const normalizedLocalValue = type === "number" ? Number(localValue) : localValue;
        const normalizedValue = type === "number" ? Number(value) : value;

        if (normalizedLocalValue === normalizedValue || (localValue === "" && value === null)) {
            setEditing(false);
            return;
        }

        const finalValue = type === "number" && localValue !== "" ? Number(localValue) : localValue;

        dispatch(
            updateProduct({
                productId,
                field,
                value: finalValue,
                token,
            })
        )
            .unwrap()
            .then(() => toast.success(`${field} updated`))
            .catch((err) => toast.error(err.message || "Update failed"));

        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') {
            setLocalValue(String(value ?? ""));
            setEditing(false);
        }
    };

    const displayValue = format(value) || "—";

    // Read-Only Style
    if (isReadOnly) {
        return (
            <div className="flex items-center gap-2 py-1">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-900 truncate">
                    {displayValue}
                </span>
            </div>
        );
    }

    // Editable Style
    return (
        <div className="flex items-center gap-2 min-h-7.5 transition-all duration-150 rounded-lg pr-1">
            {editing ? (
                <div className="flex items-center gap-2 w-full">
                    <input
                        autoFocus
                        type={type}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className="border border-indigo-300 px-2 py-1 rounded-lg w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder={`Enter ${field}`}
                    />
                    {/* Explicit Save/Cancel buttons are good UX, but keeping auto-save on blur as per original */}
                    <Check
                        size={18}
                        className="cursor-pointer text-green-600 hover:text-green-700 transition shrink-0"
                        onClick={save}
                    />
                    <X
                        size={18}
                        className="cursor-pointer text-red-500 hover:text-red-700 transition shrink-0"
                        onClick={() => {
                            setLocalValue(String(value ?? ""));
                            setEditing(false);
                        }}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 w-full">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm text-gray-700 w-full min-w-12.5 transition">
                        {displayValue}
                    </span>
                    <Pencil
                        size={16}
                        className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent modal closing if this component is used inside a clickable area
                            setEditing(true);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

/* ----------------------------------
COMPONENT: Editable Category
----------------------------------- */
const EditableCategory = ({ product, isReadOnly = false }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.admin);
    const token = localStorage.getItem("token");

    const [editing, setEditing] = useState(false);
    const initialCategory = product.category?._id || product.category || "";
    const [value, setValue] = useState(initialCategory);

    useEffect(() => {
        if (!editing) {
            setValue(initialCategory);
        }
    }, [initialCategory, editing]);

    const save = () => {
        if (isReadOnly) return;
        if (value === initialCategory) {
            setEditing(false);
            return;
        }

        dispatch(
            updateProduct({
                productId: product._id,
                field: "category",
                value,
                token,
            })
        )
            .unwrap()
            .then(() => toast.success("Category updated"))
            .catch((err) => toast.error(err.message || "Update failed"));

        setEditing(false);
    };

    const currentCategory = categories.find(cat => cat._id === initialCategory);
    const currentCategoryName = currentCategory ? currentCategory.name : (product.category?.name || "—");

    if (isReadOnly) {
        return (
            <div className="flex items-center gap-2 py-1">
                <Layers className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                    {currentCategoryName}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 min-h-7.5 transition-all duration-150 rounded-lg pr-1">
            {editing ? (
                <div className="flex items-center gap-2 w-full">
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={save}
                        className="border border-indigo-300 px-2 py-1 rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full transition"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <Check
                        size={18}
                        className="cursor-pointer text-green-600 hover:text-green-700 transition shrink-0"
                        onClick={save}
                    />
                    <X
                        size={18}
                        className="cursor-pointer text-red-500 hover:text-red-700 transition shrink-0"
                        onClick={() => {
                            setValue(initialCategory);
                            setEditing(false);
                        }}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 w-full">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 w-full transition">
                        {currentCategoryName}
                    </span>
                    <Pencil
                        size={16}
                        className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
                        onClick={() => setEditing(true)}
                    />
                </div>
            )}
        </div>
    );
};

/* ----------------------------------
COMPONENT: Editable Size Field
----------------------------------- */
const EditableSizeField = ({ label, value = {}, productId, field, isReadOnly = false }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const [editing, setEditing] = useState(false);
    const [size, setSize] = useState({
        length: String(value.length || ""),
        width: String(value.width || ""),
        height: String(value.height || ""),
    });

    useEffect(() => {
        if (!editing) {
            setSize({
                length: String(value.length || ""),
                width: String(value.width || ""),
                height: String(value.height || ""),
            });
        }
    }, [value, editing]);

    const save = () => {
        if (isReadOnly) return;
        
        // Convert to numbers for API, but handle empty strings gracefully by using undefined
        const finalSize = {
            length: size.length === "" ? undefined : Number(size.length),
            width: size.width === "" ? undefined : Number(size.width),
            height: size.height === "" ? undefined : Number(size.height),
        };

        dispatch(
            updateProduct({
                productId,
                field,
                value: finalSize,
                token,
            })
        )
            .unwrap()
            .then(() => toast.success(`${label} updated`))
            .catch((err) => toast.error(err.message || "Update failed"));

        setEditing(false);
    };

    const displayValue = useMemo(() => {
        const l = value.length ?? "—";
        const w = value.width ?? "—";
        const h = value.height ?? "—";
        return `${l} × ${w} × ${h} inches`;
    }, [value]);

    const inputClasses = "border border-gray-300 px-2 py-1 rounded-lg w-16 text-sm shadow-sm transition focus:ring-indigo-500 focus:border-indigo-500";

    return (
        <div className="p-3 border rounded-lg bg-white shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-1">
                <Box className="w-3 h-3"/> {label}
            </label>
            {isReadOnly ? (
                <div className="mt-1 text-sm font-bold text-gray-900">
                    {displayValue}
                </div>
            ) : (
                <div className="mt-1 min-h-7.5 flex items-center gap-2">
                    {editing ? (
                        <div className="flex items-center gap-3">
                            {["length", "width", "height"].map((key) => (
                                <input
                                    key={key}
                                    placeholder={key[0].toUpperCase()}
                                    type="number"
                                    value={size[key]}
                                    onChange={(e) =>
                                        setSize({ ...size, [key]: e.target.value })
                                    }
                                    className={inputClasses}
                                />
                            ))}
                            <Check
                                size={18}
                                className="cursor-pointer text-green-600 hover:text-green-700 transition shrink-0"
                                onClick={save}
                            />
                            <X
                                size={18}
                                className="cursor-pointer text-red-500 hover:text-red-700 transition shrink-0"
                                onClick={() => {
                                    setSize({ length: String(value.length || ""), width: String(value.width || ""), height: String(value.height || "") });
                                    setEditing(false);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{displayValue}</span>
                            <Pencil
                                size={16}
                                className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
                                onClick={() => setEditing(true)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ----------------------------------
COMPONENT: Product Modal (Edit/View)
----------------------------------- */
const ProductModal = ({ product, onClose, isReadOnly = false }) => {
    if (!product) return null;

    const title = isReadOnly ? `View Product: ${product.name}` : `Edit Product: ${product.name}`;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ease-out transform scale-100">
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-indigo-50/70 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-6">

                        {/* Category & Description Section */}
                        <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50/50 space-y-4">
                            <h3 className="text-md font-bold text-indigo-700 border-b pb-2 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Categorization & Details
                            </h3>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                                <EditableCategory product={product} isReadOnly={isReadOnly} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                                <EditableField
                                    value={product.description}
                                    field="description"
                                    productId={product._id}
                                    isReadOnly={isReadOnly}
                                    type="text" // Treat description as a longer text field
                                />
                            </div>
                        </div>
                        
                        {/* General Fields Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-xl bg-gray-50/50">
                            {PRODUCT_FIELDS.filter(f => f.field !== 'description').map(({ label, field, type, format, icon }) => (
                                <div key={field} className="space-y-1 p-2 bg-white border rounded-lg shadow-sm">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
                                        {label}
                                    </label>
                                    <EditableField
                                        value={product[field]}
                                        field={field}
                                        type={type}
                                        productId={product._id}
                                        isReadOnly={isReadOnly}
                                        format={format}
                                        Icon={icon}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Size Fields Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                            <EditableSizeField
                                label="Item Dimensions"
                                value={product.itemSize}
                                field="itemSize"
                                productId={product._id}
                                isReadOnly={isReadOnly}
                            />
                            <EditableSizeField
                                label="Carton/Package Dimensions"
                                value={product.cartonSize}
                                field="cartonSize"
                                productId={product._id}
                                isReadOnly={isReadOnly}
                            />
                        </div>

                        {/* Metadata (Read-only) */}
                        <div className="p-4 rounded-xl bg-gray-100 mt-2 border border-gray-200">
                            <p className="text-xs font-bold text-gray-600 flex items-center gap-2 mb-2 uppercase tracking-wider">
                                <Factory className="w-4 h-4" /> Metadata
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <p className="text-gray-700">Product SKU: <span className="font-mono text-xs ml-2 text-indigo-700">{product.productSKU || '—'}</span></p>
                                <p className="text-gray-700">Database ID: <span className="font-mono text-xs ml-2 text-gray-500">{product._id || '—'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER - Only shows edit instructions if not read-only */}
                {!isReadOnly && (
                    <div className="px-6 py-3 border-t border-gray-100 text-right text-sm text-gray-500 bg-gray-50 rounded-b-2xl">
                        *Click the <Pencil className="w-3 h-3 inline-block" /> icon to edit. Changes save automatically on blur/enter.
                    </div>
                )}
            </div>
        </div>
    );
};

/* ----------------------------------
COMPONENT: Create Item Modal
----------------------------------- */
const CreateItemModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { products, loading: productsLoading } = useSelector((state) => state.admin);

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (products.length > 0 && productId === "") {
            setProductId(products[0]._id);
        }
    }, [products, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || quantity <= 0) {
            toast.error("Please select a product and enter a valid quantity.");
            return;
        }
        
        setIsCreating(true);

        try {
            const newItems = await dispatch(createItem({ productId, quantity, token })).unwrap();
            toast.success(`${newItems.length} item(s) created successfully!`);
            onClose();
            dispatch(fetchItems()); // Refetch items to update the main list
        } catch (err) {
            toast.error(err.message || "Failed to create item(s).");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-green-50/70 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-green-600" />
                        Add New Stock (Item)
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY (Form) */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="space-y-5">
                        {/* Product Select */}
                        <div>
                            <label
                                htmlFor="product"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Select Product Template
                            </label>
                            {productsLoading ? (
                                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading products...
                                </div>
                            ) : (
                                <select
                                    id="product"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                    disabled={products.length === 0 || isCreating}
                                >
                                    {products.length === 0 ? (
                                        <option value="" disabled>
                                            No products available. Create one first.
                                        </option>
                                    ) : (
                                        products.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name} (SKU: {p.productSKU})
                                            </option>
                                        ))
                                    )}
                                </select>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Quantity to Add (Individual Items)
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min="1"
                                className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                                disabled={isCreating}
                            />
                        </div>
                    </div>

                    {/* FOOTER - Submit Button */}
                    <div className="pt-6 text-right border-t border-gray-100 mt-6">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            disabled={products.length === 0 || isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating Item(s)...</span>
                                </>
                            ) : (
                                <span>Add {quantity} Item(s) to Stock</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ----------------------------------
COMPONENT: Item Detail Row (for expanded view)
----------------------------------- */
const ItemDetailRow = ({ item }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const qrSrc = item.qrCodeUrl || item.qrCode;

    const downloadQR = (e) => {
        e.stopPropagation();
        if (!qrSrc) return;
        const link = document.createElement("a");
        link.href = qrSrc;
        link.download = `${item.itemSKU}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const statusClasses = (status) => {
        const s = status || "available";
        return s === "available"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
    };

    return (
        <>
            <tr className="bg-white border-b border-gray-100 transition hover:bg-gray-50">
                <td className="px-6 py-3 text-xs font-mono text-gray-700 pl-16">
                    {item.itemSKU}
                </td>

                <td className="px-6 py-3 text-xs">
                    <button
                        onClick={() => setSelectedProduct(item.product)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    >
                        {item.product?.name || "Unknown Product"}
                    </button>
                </td>

                <td className="px-6 py-3 text-xs">
                    <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses(item.status)}`}
                    >
                        {item.status || "available"}
                    </span>
                </td>

                <td className="px-6 py-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Scan className="w-3 h-3"/>
                        {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </td>

                {/* QR CODE COLUMN */}
                <td className="px-6 py-3 text-xs">
                    {qrSrc ? (
                        <div className="flex items-center gap-2">
                            <img
                                src={qrSrc}
                                alt="QR Code"
                                className="w-8 h-8 cursor-pointer hover:scale-150 transition-transform duration-200"
                                onClick={downloadQR}
                            />
                            <button
                                onClick={downloadQR}
                                className="text-indigo-600 hover:text-indigo-800 hover:underline text-xs"
                            >
                                Download
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}
                </td>
            </tr>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    isReadOnly
                />
            )}
        </>
    );
};

/* ----------------------------------
MAIN ITEMS PAGE (Final Grouped Version)
----------------------------------- */
const ItemsPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.admin);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [expandedProductId, setExpandedProductId] = useState(null); 

    useEffect(() => {
        dispatch(fetchItems());
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    // **CORE LOGIC: Grouping and Aggregation**
    const groupedInventory = useMemo(() => {
        const groups = {};
        
        items.forEach(item => {
            const productId = item.product?._id;
            if (!productId) return; 

            if (!groups[productId]) {
                groups[productId] = {
                    product: item.product, 
                    totalStock: 0,
                    availableStock: 0,
                    outOfStock: 0,
                    itemsList: [],
                };
            }

            groups[productId].totalStock += 1;
            groups[productId].itemsList.push(item);

            if ((item.status || "available") === "available") {
                groups[productId].availableStock += 1;
            } else {
                groups[productId].outOfStock += 1;
            }
        });

        return Object.values(groups);
    }, [items]); 
    
    // Handler for expansion
    const toggleItemsList = (productId) => {
        setExpandedProductId(prevId => prevId === productId ? null : productId);
    };

    const initialLoad = loading && items.length === 0;

    if (initialLoad) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <span className="mt-4 text-xl font-medium text-gray-700">Loading inventory items...</span>
            </div>
        );
    }

    // --- RENDERING GROUPED TABLE (Main View) ---
    const renderGroupedTable = () => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50/70 border-b-2 border-indigo-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Package className="w-4 h-4"/> Product Name / SKU</span>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Warehouse className="w-4 h-4"/> Total Stock</span>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            Available
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            Out of Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {groupedInventory.length > 0 ? (
                        groupedInventory.map((group) => {
                            const isExpanded = expandedProductId === group.product._id;
                            const productSKU = group.product.productSKU || 'N/A';
                            return (
                                <React.Fragment key={group.product._id}>
                                    {/* Main Product Row */}
                                    <tr className={`transition duration-150 ${isExpanded ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setSelectedProduct(group.product)}
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                                            >
                                                {group.product.name}
                                            </button>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {productSKU}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-extrabold text-gray-900">
                                            {group.totalStock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                                                {group.availableStock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {group.outOfStock > 0 ? (
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">
                                                    {group.outOfStock}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-xs">0</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => toggleItemsList(group.product._id)}
                                                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Hide Items <ChevronUp className="w-4 h-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        View {group.totalStock} Items <ChevronDown className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Item List Table */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan="5" className="p-0 border-t border-gray-200 bg-gray-50">
                                                <div className="overflow-x-auto p-4">
                                                    <h4 className="text-sm font-bold text-gray-700 mb-2 pl-12">
                                                        Individual Item Tracking:
                                                    </h4>
                                                    <table className="min-w-full">
                                                        <thead className="border-b border-gray-200">
                                                            <tr className="text-gray-500">
                                                                <th className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider pl-16">
                                                                    Item SKU
                                                                </th>
                                                                <th className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                                                    Product Name
                                                                </th>
                                                                <th className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                                                    Status
                                                                </th>
                                                                <th className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                                                    Date Added
                                                                </th>
                                                                <th className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider">
                                                                    QR Code
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {group.itemsList.map(item => (
                                                                <ItemDetailRow key={item._id} item={item} />
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-lg text-gray-500">
                                <Box className="w-10 h-10 mx-auto mb-4 text-gray-300"/>
                                <p>No inventory items found. Add new stock to begin tracking.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header and Add Button */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-4 sm:mb-0">
                        <Layers className="w-8 h-8 text-indigo-600" />
                        Stock Inventory
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-gray-500">
                            {groupedInventory.length} Products Tracked
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add New Stock
                        </button>
                    </div>
                </header>

                {/* Grouped Products Table */}
                {renderGroupedTable()}

                {/* Creation Modal */}
                {isCreateModalOpen && (
                    <CreateItemModal onClose={() => setIsCreateModalOpen(false)} />
                )}

                {/* Product Details Modal (VIEW ONLY/EDIT) */}
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        isReadOnly={false} // Allows editing from this view now
                    />
                )}
            </div>
        </div>
    );
};

export default ItemsPage;