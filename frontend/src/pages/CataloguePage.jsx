import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '../redux/slices/adminSlice';
import {
  Search,
  Box,
  Ruler,
  Weight,
  Package,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Maximize2,
  X
} from 'lucide-react';


const DetailItem = ({ icon, label, value }) => (
  <div className="group">
    <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
      {icon}
      <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
    </div>
    <p className="text-sm ml-6 font-medium text-slate-900">{value || '—'}</p>
  </div>
);


const CataloguePage = () => {
  const dispatch = useDispatch();
  const { products = [], categories = [], loading } = useSelector((state) => state.admin);


  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  // Initial Load
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ search: debouncedSearchTerm, page: 1, limit: 100, categoryId: selectedCategory }));
  }, [dispatch, debouncedSearchTerm, selectedCategory]);


  // Handle Category Change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setCurrentIndex(0);
    dispatch(fetchProducts({ search: debouncedSearchTerm, page: 1, limit: 100, categoryId }));
  };


  /* ---------------- NAVIGATION ---------------- */
  const nextProduct = useCallback(() => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);


  const prevProduct = useCallback(() => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);


  // Keyboard Navigation
  useEffect(() => {
    const handler = (e) => {
      if (showSuggestions || document.activeElement.tagName === 'INPUT') return;
      
      // ESC to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        return;
      }
      
      if (e.key === 'ArrowRight') nextProduct();
      if (e.key === 'ArrowLeft') prevProduct();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextProduct, prevProduct, showSuggestions, isFullscreen]);


  const currentProduct = products[currentIndex];
  const progress = products.length > 0 ? ((currentIndex + 1) / products.length) * 100 : 0;


  if (loading && !products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-slate-400 mb-4" size={32} />
        <p className="text-slate-500 font-light tracking-widest">LOADING COLLECTION</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen rounded-2xl selection:bg-slate-900 selection:text-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50">
        <div className="h-full bg-slate-900 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>


      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <h1 className="text-5xl font-extralight tracking-tighter">
            The <span className="font-medium text-slate-900">Catalogue</span>
          </h1>
    


          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            
            {/* Search */}
            <div className="relative flex-grow lg:flex-grow-0 lg:min-w-[320px]">
              <div className="flex items-center bg-white border border-slate-200 rounded-full px-5 py-3 shadow-sm focus-within:ring-2 ring-slate-200 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                  value={searchTerm}
                  placeholder="Search current view..."
                  className="bg-transparent w-full ml-3 outline-none text-sm"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>


            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-slate-200 rounded-full px-6 py-3 text-sm font-medium shadow-sm hover:border-slate-300 transition-colors cursor-pointer outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                  title="View Fullscreen"
                >
                  <Maximize2 size={20} className="text-slate-900" />
                </button>
        </header>


        {currentProduct ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 gap-2 items-start">
            <div className="lg:col-span-8 sticky top-10">
              <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-200 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group relative">
                <img
                  src={currentProduct.imageURL || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1500"}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  title="View Fullscreen"
                >
                  <Maximize2 size={20} className="text-slate-900" />
                </button>
              </div>
            </div>


            <div className="lg:col-span-4 space-y-2 py-2">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                  {currentProduct.category?.name || 'Uncategorized'}
                </span>
                <h2 className="text-4xl font-bold text-slate-900 leading-[1.1]">{currentProduct.name}</h2>
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl font-light text-slate-900">${currentProduct.price}</p>
                  <p className="text-md uppercase tracking-widest text-slate-400 font-bold">Item No.: {currentProduct.itemNumber}</p>
                </div>
              </div>


              <p className="text-xl text-slate-500 leading-relaxed font-light">
                {currentProduct.description || "No description available for this selected piece."}
              </p>


              <div className="bg-white rounded-[2.5rem] p-8 grid grid-cols-2 gap-y-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-slate-50">
                <DetailItem icon={<Ruler size={18} />} label="Item Size" 
                  value={currentProduct.itemSize ? `${currentProduct.itemSize.length}"L x ${currentProduct.itemSize.width}"W x ${currentProduct.itemSize.height}"H` : null} />
                <DetailItem icon={<Box size={18} />} label="Finish" value={currentProduct.finish?.name} />
                <DetailItem icon={<Weight size={18} />} label="Weight" value={currentProduct.weight} />
                <DetailItem icon={<Package size={18} />} label="Master Pack" value={currentProduct.masterPack} />
                <DetailItem icon={<Box size={18} />} label="Other Material" value={currentProduct.otherMaterial} />
                <DetailItem icon={<Ruler size={18} />} label="Carton Size" 
                  value={currentProduct.cartonSize ? `${currentProduct.cartonSize.length}"L x ${currentProduct.cartonSize.width}"W x ${currentProduct.cartonSize.height}"H` : null} />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-40 text-center space-y-4">
            <Package size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-400 text-lg font-light">No products found in this category.</p>
          </div>
        )}
      </div>


      {/* Floating Navigation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-full p-1 shadow-2xl flex items-center justify-between border border-white/10">
          <button onClick={prevProduct} className="group flex items-center gap-3 pl-4 pr-6 py-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <div className="text-left hidden sm:block">
              <p className="text-[8px] font-bold opacity-40 uppercase">Previous</p>
              <p className="text-xs">Backward</p>
            </div>
          </button>


          <div className="px-8 border-x border-white/10 text-center">
            <span className="text-white font-bold text-lg">
              {products.length > 0 ? currentIndex + 1 : 0} 
              <span className="text-white/20 mx-2">/</span> 
              {products.length}
            </span>
          </div>


          <button onClick={nextProduct} className="group flex items-center gap-3 pl-6 pr-4 py-1 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-bold opacity-40 uppercase">Discovery</p>
              <p className="text-xs font-bold">Next Piece</p>
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>


      {/* Fullscreen Modal - 20:80 ratio (details:image) */}
      {isFullscreen && currentProduct && (
        <div className="fixed inset-0 bg-black z-[100] flex">

          {/* Left Side - Details (20%) */}
          <div className="w-[80%] relative flex items-center justify-center p-4">
            <img
              src={currentProduct.imageURL || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1500"}
              alt={currentProduct.name}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all text-white"
              title="Exit Fullscreen (ESC)"
            >
              <X size={24} />
            </button>


            {/* Navigation in Fullscreen */}
            <button
              onClick={prevProduct}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-all text-white"
              title="Previous (←)"
            >
              <ArrowLeft size={24} />
            </button>


            <button
              onClick={nextProduct}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-all text-white"
              title="Next (→)"
            >
              <ArrowRight size={24} />
            </button>


            {/* Progress Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-white font-bold">
              {currentIndex + 1} / {products.length}
            </div>
          </div>

          {/* Right Side - Image (80%) */}
          <div className="w-[20%] bg-white p-8 overflow-y-auto">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                {currentProduct.category?.name || 'Uncategorized'}
              </span>
              
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">{currentProduct.name}</h2>
              
              <div className="space-y-1">
                <p className="text-2xl font-light text-slate-900">${currentProduct.price}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Item No.: {currentProduct.itemNumber}
                </p>
              </div>


              <p className="text-sm text-slate-600 leading-relaxed">
                {currentProduct.description || "No description available."}
              </p>


              <div className="space-y-4 pt-4 border-t border-slate-200">
                <DetailItem 
                  icon={<Ruler size={16} />} 
                  label="Item Size" 
                  value={currentProduct.itemSize ? `${currentProduct.itemSize.length}"L x ${currentProduct.itemSize.width}"W x ${currentProduct.itemSize.height}"H` : null} 
                />
                <DetailItem icon={<Box size={16} />} label="Finish" value={currentProduct.finish?.name} />
                <DetailItem icon={<Weight size={16} />} label="Weight" value={currentProduct.weight} />
                <DetailItem icon={<Package size={16} />} label="Master Pack" value={currentProduct.masterPack} />
                <DetailItem icon={<Box size={16} />} label="Other Material" value={currentProduct.otherMaterial} />
                <DetailItem 
                  icon={<Ruler size={16} />} 
                  label="Carton Size" 
                  value={currentProduct.cartonSize ? `${currentProduct.cartonSize.length}"L x ${currentProduct.cartonSize.width}"W x ${currentProduct.cartonSize.height}"H` : null} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default CataloguePage;
