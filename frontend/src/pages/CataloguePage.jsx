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
  Loader2
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
  const [selectedCategoryName, setSelectedCategoryName] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: 1, limit: 50 }));
  }, [dispatch]);

  // 2. Handle Category Change (Backend Fetch)
  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategoryName(categoryName);
    setCurrentIndex(0); // Reset slider position

    // Find the ID for the backend query
    const categoryObj = categories.find((cat) => cat.name === categoryName);
    const categoryId = categoryName === 'All' ? null : categoryObj?._id;

    // Trigger API call with category filter
    dispatch(fetchProducts({ page: 1, limit: 50, categoryId }));
  };

  // 3. Logic: Local Search Filtering 
  // (We still filter locally for search to keep the UI snappy, but category is handled by API)
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    return products.filter((product) => {
      const name = product?.name?.toLowerCase() || '';
      const itemNo = product?.itemNumber?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return name.includes(search) || itemNo.includes(search);
    });
  }, [products, searchTerm]);

  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return filteredProducts.slice(0, 6);
  }, [searchTerm, filteredProducts]);

  /* ---------------- NAVIGATION ---------------- */
  const nextProduct = useCallback(() => {
    if (filteredProducts.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  }, [filteredProducts.length]);

  const prevProduct = useCallback(() => {
    if (filteredProducts.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  }, [filteredProducts.length]);

  useEffect(() => {
    const handler = (e) => {
      if (showSuggestions || document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') nextProduct();
      if (e.key === 'ArrowLeft') prevProduct();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextProduct, prevProduct, showSuggestions]);

  const currentProduct = filteredProducts[currentIndex];
  const progress = filteredProducts.length > 0 ? ((currentIndex + 1) / filteredProducts.length) * 100 : 0;

  if (loading && !products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-slate-400 mb-4" size={32} />
        <p className="text-slate-500 font-light tracking-widest">LOADING COLLECTION</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] rounded-2xl pb-32 selection:bg-slate-900 selection:text-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50">
        <div className="h-full bg-slate-900 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-[1600px] mx-auto lg:p-4 p-2">
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
                    setShowSuggestions(true);
                  }}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                  {searchSuggestions.map((p, index) => (
                    <button
                      key={p._id}
                      onMouseDown={() => {
                        const i = filteredProducts.findIndex(fp => fp._id === p._id);
                        if (i !== -1) setCurrentIndex(i);
                        setSearchTerm(p.name);
                      }}
                      className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{p.itemNumber}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Select - NOW TRIGGERS BACKEND FETCH */}
            <select
              value={selectedCategoryName}
              onChange={handleCategoryChange}
              className="bg-white border border-slate-200 rounded-full px-6 py-3 text-sm font-medium shadow-sm hover:border-slate-300 transition-colors cursor-pointer outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </header>

        {currentProduct ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 gap:2 items-start">
            <div className="lg:col-span-7 sticky top-10">
              <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-200 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group">
                <img
                  src={currentProduct.imageURL || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1500"}
                  alt={currentProduct.name}
                  className="w-full h-full object-fit transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 py-4">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                  {currentProduct.category?.name || 'Uncategorized'}
                </span>
                <h2 className="text-4xl font-bold text-slate-900 leading-[1.1]">{currentProduct.name}</h2>
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl font-light text-slate-900">${currentProduct.price}</p>
                  <p className="text-md uppercase tracking-widest text-slate-400 font-bold">ID: {currentProduct.itemNumber}</p>
                </div>
              </div>

              <p className="text-xl text-slate-500 leading-relaxed font-light">
                {currentProduct.description || "No description available for this selected piece."}
              </p>

              <div className="bg-white rounded-[2.5rem] p-10 grid grid-cols-2 gap-x-8 gap-y-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-slate-50">
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
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center justify-between border border-white/10">
          <button onClick={prevProduct} className="group flex items-center gap-3 pl-4 pr-6 py-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <div className="text-left hidden sm:block">
              <p className="text-[8px] font-bold opacity-40 uppercase">Previous</p>
              <p className="text-xs">Backward</p>
            </div>
          </button>

          <div className="px-8 border-x border-white/10 text-center">
            <span className="text-white font-bold text-lg">
              {filteredProducts.length > 0 ? currentIndex + 1 : 0} 
              <span className="text-white/20 mx-2">/</span> 
              {filteredProducts.length}
            </span>
          </div>

          <button onClick={nextProduct} className="group flex items-center gap-3 pl-6 pr-4 py-2 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-bold opacity-40 uppercase">Discovery</p>
              <p className="text-xs font-bold">Next Piece</p>
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CataloguePage;