import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinishes, createFinish, deleteFinish } from '../redux/slices/adminSlice'

const FinishPage = () => {
  const dispatch = useDispatch()
  const { finishes, loading, error } = useSelector((state) => state.admin)
  const token = useSelector((state) => state.auth.token);

  // State for the Delete Confirmation Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(null);

  useEffect(() => {
    dispatch(fetchFinishes());
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    try {
      dispatch(createFinish({ name }));
      e.target.reset();
    } catch (err) {
      console.error("Failed to create finish:", err);
    }
  }

  // Open dialog and store the finish to be deleted
  const openDeleteDialog = (finish) => {
    setSelectedFinish(finish);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedFinish) {
      try {
        await dispatch(deleteFinish({ id: selectedFinish._id, token })).unwrap();
        setIsDialogOpen(false);
        setSelectedFinish(null);
      } catch (err) {
        console.error("Failed to delete finish:", err);
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      
      {/* --- DELETE CONFIRMATION DIALOG --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center">Are you sure?</h3>
            <p className="text-slate-500 text-center mt-2">
              You are about to delete <span className="font-bold text-slate-800">"{selectedFinish?.name}"</span>. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finishes Management</h1>
        <p className="text-slate-500 mt-2 font-medium">Create and manage product surface finishes and textures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Finish</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Finish Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Matte Black" 
                  required 
                  className="w-full px-5 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Finish
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-2xl border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Existing Finishes</h2>
              <span className="bg-white border border-slate-200 text-indigo-600 text-xs font-black px-3 py-1 rounded-xl shadow-sm">
                {finishes?.length || 0} ITEMS
              </span>
            </div>

            <div className="p-0 min-h-75">
              {loading ? (
                <div className="p-20 flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-indigo-600"></div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Updating Database...</p>
                </div>
              ) : finishes && finishes.length > 0 ? (
                <ul className="divide-y divide-slate-50">
                  {finishes.map((finish) => (
                    <li key={finish._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-700">{finish.name}</span>
                      </div>
                      
                      <button 
                        onClick={() => openDeleteDialog(finish)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-20 text-center">
                  <p className="text-slate-400 font-medium">No records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FinishPage