import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  updateProduct,
  createProduct,
} from "../redux/slices/adminSlice";
import toast from "react-hot-toast";
import {
  Pencil,
  Check,
  X,
  Package,
  PlusCircle,
  Loader2,
  Filter,
  Search,
  Layers,
  Tag,
  Globe,
  Box,
  Download,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { downloadQR, downloadAllQRsZip } from '../utils/qrDownloaders.js';
import { exportProductsToExcel } from "../utils/excelExporter.js";
import { uploadImageToCloudinary } from "../utils/cloudinaryUploader.js";

/* ----------------------------------
PRODUCT FIELDS (Metadata for Modals)
----------------------------------- */
const PRODUCT_FIELDS = [
  { label: "Name", field: "name", type: "text" },
  { label: "Item Number", field: "itemNumber", type: "text" },
  { label: "Description", field: "description", type: "textarea" },
  { label: "Master Pack", field: "masterPack", type: "text" },
  { label: "Weight (kg)", field: "weight", type: "text" },
  { label: "Price", field: "price", type: "number" },
  { label: "Discount %", field: "discountPercent", type: "number" },
];

// Helper for currency formatting
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Helper for size formatting
const formatSize = (size) => {
  if (!size) return "—";
  const l = size.length ?? "—";
  const w = size.width ?? "—";
  const h = size.height ?? "—";
  return `${l} × ${w} × ${h}`;
};

/* ----------------------------------
EDITABLE FIELD
----------------------------------- */
const EditableField = ({ value, field, productId, type = "text" }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value ?? ""));

  useEffect(() => {
    if (!editing) {
      setLocalValue(String(value ?? ""));
    }
  }, [value, editing]);

  const save = () => {
    const normalizedLocalValue =
      type === "number" ? Number(localValue) : localValue;
    const normalizedValue = type === "number" ? Number(value) : value;

    if (
      normalizedLocalValue === normalizedValue ||
      (localValue === "" && (value === null || value === undefined))
    ) {
      setEditing(false);
      return;
    }

    const finalValue =
      type === "number" && localValue !== "" ? Number(localValue) : localValue;

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
    if (e.key === "Enter" && type !== "textarea") save();
    if (e.key === "Escape") {
      setLocalValue(String(value ?? ""));
      setEditing(false);
    }
  };

  const displayValue = field === "price" ? formatCurrency(value) : value || "—";

  const InputComponent = type === "textarea" ? "textarea" : "input";
  const inputProps = {
    autoFocus: true,
    type: type === "number" ? "number" : "text",
    value: localValue,
    onChange: (e) => setLocalValue(e.target.value),
    onBlur: save,
    onKeyDown: handleKeyDown,
    className: `border border-indigo-300 px-2 py-1 rounded-lg w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition ${type === "textarea" ? "min-h-[80px]" : ""
      }`,
    placeholder: `Enter ${field}`,
  };

  return (
    <div className="flex items-center gap-2 min-h-8">
      {editing ? (
        <>
          <InputComponent {...inputProps} />
          <div className="flex gap-1 shrink-0">
            <Check
              size={16}
              className="cursor-pointer text-green-600 hover:text-green-700 transition"
              onClick={save}
            />
            <X
              size={16}
              className="cursor-pointer text-red-500 hover:text-red-700 transition"
              onClick={() => {
                setLocalValue(String(value ?? ""));
                setEditing(false);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-700 w-full min-w-15 truncate">
            {displayValue}
          </span>
          <Pencil
            size={14}
            className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
            onClick={() => setEditing(true)}
          />
        </>
      )}
    </div>
  );
};

/* ----------------------------------
EDITABLE OTHER MATERIALS (NEW - ARRAY SUPPORT)
----------------------------------- */
const EditableOtherMaterials = ({ productId, materials = [] }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  
  const [editing, setEditing] = useState(false);
  const [localMaterials, setLocalMaterials] = useState(Array.isArray(materials) ? materials : []);
  const [newMaterial, setNewMaterial] = useState("");

  useEffect(() => {
    if (!editing) {
      setLocalMaterials(Array.isArray(materials) ? materials : []);
    }
  }, [materials, editing]);

  const addMaterial = () => {
    if (newMaterial.trim() === "") return;
    setLocalMaterials([...localMaterials, newMaterial.trim()]);
    setNewMaterial("");
  };

  const removeMaterial = (index) => {
    setLocalMaterials(localMaterials.filter((_, i) => i !== index));
  };

  const save = () => {
    const cleanedMaterials = localMaterials.filter(m => m.trim() !== "");
    
    dispatch(
      updateProduct({
        productId,
        field: "otherMaterial",
        value: cleanedMaterials,
        token,
      })
    )
      .unwrap()
      .then(() => toast.success("Materials updated"))
      .catch((err) => toast.error(err.message || "Update failed"));

    setEditing(false);
  };

  const cancel = () => {
    setLocalMaterials(Array.isArray(materials) ? materials : []);
    setNewMaterial("");
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 min-h-8">
      {editing ? (
        <div className="space-y-2">
          {/* Existing Materials */}
          <div className="flex flex-col gap-1">
            {localMaterials.map((material, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={material}
                  onChange={(e) => {
                    const updated = [...localMaterials];
                    updated[index] = e.target.value;
                    setLocalMaterials(updated);
                  }}
                  className="border border-indigo-300 px-2 py-1 rounded-lg flex-1 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <X
                  size={16}
                  className="cursor-pointer text-red-500 hover:text-red-700 transition shrink-0"
                  onClick={() => removeMaterial(index)}
                />
              </div>
            ))}
          </div>

          {/* Add New Material */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMaterial();
                }
              }}
              placeholder="Add material..."
              className="border border-indigo-300 px-2 py-1 rounded-lg flex-1 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <PlusCircle
              size={16}
              className="cursor-pointer text-green-600 hover:text-green-700 transition shrink-0"
              onClick={addMaterial}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={save}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              <Check size={14} />
              Save
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 items-center">
            {localMaterials.length > 0 ? (
              localMaterials.map((material, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                >
                  {material}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">—</span>
            )}
            <Pencil
              size={14}
              className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
              onClick={() => setEditing(true)}
            />
          </div>
        </>
      )}
    </div>
  );
};

/* ----------------------------------
EDITABLE CATEGORY & FINISH
----------------------------------- */
const EditableCategory = ({ product }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.admin);
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  const initialCategory = product.category?._id || "";
  const [value, setValue] = useState(initialCategory);

  useEffect(() => {
    if (!editing) {
      setValue(initialCategory);
    }
  }, [initialCategory, editing]);

  const save = () => {
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

  const currentCategoryName = product.category?.name || "—";

  return (
    <div className="flex items-center gap-2 min-h-8">
      {editing ? (
        <>
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
            size={16}
            className="cursor-pointer text-green-600 hover:text-green-700 transition shrink-0"
            onClick={save}
          />
          <X
            size={16}
            className="cursor-pointer text-red-500 hover:text-red-700 transition shrink-0"
            onClick={() => setEditing(false)}
          />
        </>
      ) : (
        <>
          <span className="text-sm text-gray-700 w-full truncate font-medium flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
            {currentCategoryName}
          </span>
          <Pencil
            size={14}
            className="cursor-pointer text-gray-400 hover:text-indigo-600 transition shrink-0"
            onClick={() => setEditing(true)}
          />
        </>
      )}
    </div>
  );
};

const EditableFinish = ({ product }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  // finish is now a string, so we use it directly
  const [value, setValue] = useState(product.finish || "");

  useEffect(() => {
    if (!editing) setValue(product.finish || "");
  }, [product.finish, editing]);

  const save = () => {
    if (value === product.finish) {
      setEditing(false);
      return;
    }

    dispatch(
      updateProduct({
        productId: product._id,
        field: "finish",
        value,
        token,
      })
    )
      .unwrap()
      .then(() => toast.success("Finish updated"))
      .catch(() => toast.error("Update failed"));

    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 min-h-8">
      {editing ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            className="border border-indigo-300 px-2 py-1 rounded-lg text-sm w-full shadow-sm focus:ring-indigo-500"
          />
          <Check size={16} className="cursor-pointer text-green-600" onClick={save} />
          <X size={16} className="cursor-pointer text-red-500" onClick={() => setEditing(false)} />
        </>
      ) : (
        <>
          <span className="text-sm text-gray-700 w-full truncate">
            {product.finish || "—"}
          </span>
          <Pencil size={14} className="cursor-pointer text-gray-400" onClick={() => setEditing(true)} />
        </>
      )}
    </div>
  );
};

const EditableImage = ({ productId, currentImage }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic Validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setUploading(true);
      const loadingToast = toast.loading("Uploading image...");

      const imageUrl = await uploadImageToCloudinary(file);

      await dispatch(updateProduct({
        productId,
        field: "imageURL",
        value: imageUrl,
        token
      })).unwrap();

      toast.success("Image updated successfully", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to update image", { id: "upload-error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group w-full h-full min-h-30 max-h-30 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
      {currentImage ? (
        <>
          <img
            src={currentImage}
            alt="Product"
            className="w-full h-full object-contain p-2"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition">
              {uploading ? "Processing..." : "Replace Image"}
              <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-indigo-500 transition">
          <PlusCircle className="w-10 h-10" />
          <span className="text-sm font-medium">Upload Product Image</span>
          <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

/* ----------------------------------
PRODUCT MODAL
----------------------------------- */
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ease-out">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-indigo-50/70 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Edit Product: {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CATEGORY / FINISH (LEFT) + IMAGE (RIGHT) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-xl bg-indigo-50/50">

              {/* LEFT COLUMN */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <label className="text-xs font-semibold uppercase text-gray-700 mb-1 block">
                    Category
                  </label>
                  <EditableCategory product={product} />
                </div>

                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <label className="text-xs font-semibold uppercase text-gray-700 mb-1 block">
                    Finish
                  </label>
                  <EditableFinish product={product} />
                </div>
              </div>

              {/* RIGHT COLUMN – IMAGE */}
              <div className="p-3 bg-white border rounded-lg shadow-sm flex flex-col">
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Product Photo
                </label>
                <EditableImage
                  productId={product._id}
                  currentImage={product.imageURL}
                />
              </div>
            </div>

            {/* OTHER FIELDS */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT_FIELDS.filter((f) => f.field !== "description").map(
                ({ label, field, type }) => (
                  <div
                    key={field}
                    className="space-y-1 p-2 bg-white border rounded-lg shadow-sm"
                  >
                    <label className="text-xs font-semibold uppercase text-gray-500 block">
                      {label}
                    </label>
                    <EditableField
                      value={product[field]}
                      field={field}
                      type={type}
                      productId={product._id}
                    />
                  </div>
                )
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 space-y-1 p-2 bg-white border rounded-lg shadow-sm">
              <label className="text-xs font-semibold uppercase text-gray-500 block">
                Description
              </label>
              <EditableField
                value={product.description}
                field="description"
                type="textarea"
                productId={product._id}
              />
            </div>

            {/* OTHER MATERIALS (NEW) */}
            <div className="md:col-span-2 space-y-1 p-3 bg-white border rounded-lg shadow-sm">
              <label className="text-xs font-semibold uppercase text-gray-500 block">
                Other Materials
              </label>
              <EditableOtherMaterials 
                productId={product._id}
                materials={product.otherMaterial || []}
              />
            </div>

            {/* SIZE INFO */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              <div className="p-3 border rounded-lg bg-white shadow-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-1">
                  <Box className="w-3 h-3" /> Item Dimensions (")
                </label>
                <span className="text-sm font-medium text-gray-700">
                  {formatSize(product.itemSize)}
                </span>
              </div>

              <div className="p-3 border rounded-lg bg-white shadow-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-1">
                  <Box className="w-3 h-3" /> Carton Dimensions (")
                </label>
                <span className="text-sm font-medium text-gray-700">
                  {formatSize(product.cartonSize)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-gray-100 text-right text-sm text-gray-500 bg-gray-50 rounded-b-2xl">
          Click the <Pencil className="w-3 h-3 inline-block" /> icon to edit. Changes
          save automatically on blur/enter.
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
CREATE PRODUCT MODAL
----------------------------------- */
const CreateProductModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { categories, finishes } = useSelector((state) => state.admin);

  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [materialInput, setMaterialInput] = useState("");

  const initialCategory = categories.length > 0 ? categories[0]._id : "";

  const [formData, setFormData] = useState({
    name: "",
    itemNumber: "",
    description: "",
    category: initialCategory,
    masterPack: "",
    weight: "",
    finish: "",
    otherMaterial: [],
    price: "",
    discountPercent: "",
    itemSize: { length: "", width: "", height: "" },
    cartonSize: { length: "", width: "", height: "" },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSizeChange = (e, sizeType) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [sizeType]: { ...prevData[sizeType], [name]: value },
    }));
  };

  const addMaterial = () => {
    if (materialInput.trim() === "") return;
    setFormData(prev => ({
      ...prev,
      otherMaterial: [...prev.otherMaterial, materialInput.trim()]
    }));
    setMaterialInput("");
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      otherMaterial: prev.otherMaterial.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) {
      toast.error("Product Name and Category are required.");
      return;
    }

    try {
      setIsCreating(true);
      let imageUrl = "";

      if (imageFile) {
        const uploadToast = toast.loading("Uploading product image...");
        imageUrl = await uploadImageToCloudinary(imageFile);
        toast.success("Image uploaded!", { id: uploadToast });
      }

      const productData = {
        ...formData,
        imageURL: imageUrl,
        price: formData.price !== "" ? Number(formData.price) : undefined,
        discountPercent: formData.discountPercent !== "" ? Number(formData.discountPercent) : undefined,
        masterPack: formData.masterPack || undefined,
        weight: formData.weight || undefined,
        itemSize: Object.fromEntries(
          Object.entries(formData.itemSize).map(([key, val]) => [key, val !== "" ? Number(val) : undefined])
        ),
        cartonSize: Object.fromEntries(
          Object.entries(formData.cartonSize).map(([key, val]) => [key, val !== "" ? Number(val) : undefined])
        ),
      };

      await dispatch(createProduct({ productData, token })).unwrap();

      toast.success("Product created successfully!");
      onClose();
      dispatch(fetchProducts());
    } catch (err) {
  const message =
    typeof err === "string"
      ? err
      : err?.message || "Failed to create product.";

  toast.error(message);
}
     finally {
      setIsCreating(false);
    }
  };

  const inputClasses =
    "border border-gray-300 px-3 py-2 rounded-lg w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition";
  const sizeInputClasses =
    "border border-gray-300 px-3 py-2 rounded-lg w-1/3 text-sm shadow-sm transition";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-green-50/70 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-600" />
            Create New Product Template
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY (Form) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

            <div className="md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-indigo-300 transition-colors">
              {imagePreview ? (
                <div className="relative w-32 h-32 mb-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg shadow-md" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-indigo-600">
                  <PlusCircle className="w-10 h-10" />
                  <span className="text-sm font-medium">Add Product Image</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>

            {/* Essential Fields */}
            <div className="md:col-span-2 p-3 bg-indigo-50/50 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  disabled={isCreating || categories.length === 0}
                >
                  {categories.length === 0 && (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Finish
  </label>
  <input
    name="finish"
    type="text"
    placeholder="e.g. Matte, Polished, Chrome"
    value={formData.finish}
    onChange={handleChange}
    className={inputClasses}
  />
</div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClasses} min-h-20`}
                disabled={isCreating}
              />
            </div>

            {/* Specifications */}
            <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
              <div className="col-span-2 lg:col-span-4 text-sm font-bold text-gray-600 border-b pb-2">
                SPECIFICATIONS
              </div>
              {PRODUCT_FIELDS.filter(
                (f) => !["name", "description", "category"].includes(f.field)
              ).map(({ label, field, type }) => (
                <div key={field} className="col-span-1">
                  <label
                    htmlFor={field}
                    className="block text-xs font-semibold uppercase text-gray-600 mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={type || "text"}
                    value={formData[field]}
                    onChange={handleChange}
                    className={inputClasses}
                    disabled={isCreating}
                  />
                </div>
              ))}
            </div>

            {/* OTHER MATERIALS (NEW) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Other Materials
              </label>
              
              {/* Display existing materials */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.otherMaterial.map((material, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm"
                  >
                    {material}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => removeMaterial(index)}
                    />
                  </span>
                ))}
              </div>

              {/* Add new material */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMaterial();
                    }
                  }}
                  placeholder="Enter material and press Enter or +"
                  className={inputClasses}
                  disabled={isCreating}
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={isCreating || !materialInput.trim()}
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Size Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-2 p-3 border rounded-lg bg-gray-50/50">
                <label className="text-sm font-semibold text-gray-700 block">
                  Item Dimensions (L × W × H in inches)
                </label>
                <div className="flex gap-2">
                  {["length", "width", "height"].map((key) => (
                    <input
                      key={`itemSize-${key}`}
                      name={key}
                      type="number"
                      placeholder={key[0].toUpperCase()}
                      value={formData.itemSize[key]}
                      onChange={(e) => handleSizeChange(e, "itemSize")}
                      className={sizeInputClasses}
                      disabled={isCreating}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2 p-3 border rounded-lg bg-gray-50/50">
                <label className="text-sm font-semibold text-gray-700 block">
                  Carton Dimensions (L × W × H in inches)
                </label>
                <div className="flex gap-2">
                  {["length", "width", "height"].map((key) => (
                    <input
                      key={`cartonSize-${key}`}
                      name={key}
                      type="number"
                      placeholder={key[0].toUpperCase()}
                      value={formData.cartonSize[key]}
                      onChange={(e) => handleSizeChange(e, "cartonSize")}
                      className={sizeInputClasses}
                      disabled={isCreating}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-6 border-t mt-6 text-right">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg transform hover:-translate-y-0.5"
              disabled={isCreating || !formData.name.trim() || !formData.category}
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
              {isCreating ? "Uploading & Creating..." : "Create Product Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------
MAIN PRODUCTS TABLE (NO SKU)
----------------------------------- */
const ProductsTable = ({ products, onEdit, sortOrder, setSortOrder, setCurrentPage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-indigo-50 to-purple-50">
            <tr>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Img</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">
                <div className="flex items-center gap-1">
                  Item #
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 cursor-pointer ${sortOrder === "asc" ? "text-gray-400" : "text-indigo-600"}`}
                      onClick={() => {
                        setSortOrder("asc");
                        setCurrentPage(1);
                      }}
                    />
                    <ChevronDown
                      className={`w-3 h-3 cursor-pointer ${sortOrder === "desc" ? "text-gray-400" : "text-indigo-600"}`}
                      onClick={() => {
                        setSortOrder("desc");
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Product</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Category</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Finish</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Price</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Dis%</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Dis. Price</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase leading-tight">Size (L×W×H)</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Wt</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">Material</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase leading-tight">Ctn Size</th>
              <th className="px-2 py-3 text-left text-[12px] font-bold text-gray-700 uppercase">M.Pack</th>
              <th className="px-2 py-3 text-center text-[12px] font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-2 py-2 whitespace-nowrap">
                  {product.imageURL ? (
                    <img src={product.imageURL} alt={product.name} className="w-12 h-12 object-contain rounded shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded border border-gray-100">
                      <Package className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className="text-[12px] font-mono text-gray-600">
                    {product.itemNumber || "—"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col min-w-[120px]">
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                      {product.description || "No description"}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    {product.category?.name || "—"}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
  <span 
    className="block max-w-[150px] truncate" 
    title={product.finish}
  >
    {product.finish || "—"}
  </span>
</td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-bold text-gray-800">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-bold text-red-600 text-center">
                  {product.discountPercent ? `${product.discountPercent}%` : "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-bold text-red-700">
                  {product.discountPercent
                    ? formatCurrency(product.price * (1 - product.discountPercent / 100))
                    : "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-mono text-gray-600">
                  {formatSize(product.itemSize)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                  {product.weight ? `${product.weight}kg` : "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-600 max-w-[80px]">
                  <div className="flex flex-wrap gap-1">
                    {product.otherMaterial && Array.isArray(product.otherMaterial) && product.otherMaterial.length > 0 ? (
                      product.otherMaterial.map((material, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] truncate max-w-[70px]"
                          title={material}
                        >
                          {material}
                        </span>
                      ))
                    ) : (
                      "—"
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm font-mono text-gray-600">
                  {formatSize(product.cartonSize)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-600">
                  {product.masterPack || "—"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadQR(product); }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(product._id)}
                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 px-6">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            No products match the current filters.
          </p>
        </div>
      )}
    </div>
  );
};

/* ----------------------------------
MAIN PAGE (Updated Search: no SKU)
----------------------------------- */
const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, categories, pagination, loading } = useSelector(
    (state) => state.admin
  );
  const [currentPage, setCurrentPage] = useState(1);

  console.log(products);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search: debouncedSearchTerm,
        sort: sortOrder,
        page: currentPage,
        limit: 100,
        categoryId: selectedCategory,
      })
    );
  }, [dispatch, debouncedSearchTerm, sortOrder, currentPage, selectedCategory]);


  useEffect(() => {
    dispatch(fetchCategories());
    // dispatch(fetchFinishes());
  }, [dispatch]);


  const handleDownloadAllQRZips = async () => {
    if (products.length === 0) {
      toast.error("No products available to download.");
      return;
    }

    try {
      setIsDownloadingAll(true);
      toast.loading("Generating QR codes, please wait...", { id: "qr-zip" });

      await downloadAllQRsZip(products);

      toast.success("QR ZIP downloaded successfully!", { id: "qr-zip" });
    } catch (error) {
      toast.error("Failed to generate ZIP file.", { id: "qr-zip" });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleExportExcel = () => {
    if (products.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      exportProductsToExcel(products);
      toast.success("Excel file generated!");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Failed to export Excel file");
    }
  };

  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId),
    [products, selectedProductId]
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="mt-4 text-xl font-medium text-gray-700">
          Loading product catalog...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
              Product Catalog
            </h1>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
              Manage your product templates ({products.length} total)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={handleExportExcel}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">Excel</span>
            </button>

            <button
              onClick={handleDownloadAllQRZips}
              disabled={isDownloadingAll}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow disabled:opacity-50"
            >
              {isDownloadingAll ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Download className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{isDownloadingAll ? "..." : "All QRs"}</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="col-span-2 sm:col-auto flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition shadow order-first sm:order-last"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              <span>Create New Product</span>
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50">
          <div className="flex items-center gap-3 flex-1 lg:w-64">
            <Filter className="w-5 h-5 text-indigo-600 shrink-0" />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="flex-1 text-sm font-medium focus:outline-none bg-transparent border-none"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products by item number, name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
            />
          </div>

          <div className="text-sm text-gray-600 font-medium flex items-center gap-1 lg:ml-auto">
            <span className="font-bold text-indigo-600">
              {products.length}
            </span>{" "}
            of <span className="font-bold">{products.length}</span> products
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable
          products={products}
          onEdit={setSelectedProductId}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setCurrentPage={setCurrentPage}
        />

        {/* PAGINATION CONTROLS */}
        <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">
            Showing page <span className="font-bold text-gray-900">{pagination?.currentPage}</span> of{" "}
            <span className="font-bold text-gray-900">{pagination?.totalPages}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              disabled={currentPage === pagination?.totalPages || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
          />
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <CreateProductModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
