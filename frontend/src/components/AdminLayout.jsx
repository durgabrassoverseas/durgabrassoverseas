import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LogOut, Menu } from "lucide-react";

const AdminLayout = () => {
    const location = useLocation();
    
    const getPageTitle = () => {
        const path = location.pathname;
        const parts = path.split('/').filter(p => p && p !== 'admin');
        if (parts.length === 0 || parts[0] === 'dashboard') return 'Dashboard Overview';
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + ' Management';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* 1. Top Navigation Bar */}
            <Navbar />

            {/* 3. Main Content Area */}
            <main className="flex-1 max-w-8xl mx-auto w-full sm:p-4 lg:p-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Outlet />
                </div>
            </main>

            {/* 4. Footer */}
            <Footer />
        </div>
    );
};

export default AdminLayout;