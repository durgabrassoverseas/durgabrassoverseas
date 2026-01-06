import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
import { LayoutDashboard, Package, Boxes, Grid, Menu, X, LogOut } from "lucide-react"; // Added LogOut icon
import logo from "../assets/logo.png"; // adjust path if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Categories", icon: Grid, path: "/admin/categories" },
    // { name: "Finishes", icon: Boxes, path: "/admin/finishes" },
    { name: "Products", icon: Package, path: "/admin/products" },
    { name: "Catalogue", icon: Grid, path: "/admin/catalogue" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // 1. Clear your auth tokens/local storage here
    localStorage.removeItem("token");
    
    // 2. Redirect to login
    navigate("/");
    alert("You have been logged out.");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Branding */}
          <div className="flex items-center gap-2">
            <img
    src={logo}
    alt="Admin Logo"
    className="w-12 h-12 object-fit rounded-full mr-1"
  />
            <span className="text-lg font-extrabold tracking-wider text-white">
              DURGA BRASS <span className="text-indigo-400">OVERSEAS</span>
            </span>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-2 border-r border-gray-700 pr-4">
                {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                    key={item.name}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                            ? "bg-indigo-600 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`
                    }
                    >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    </NavLink>
                );
                })}
            </div>

            {/* Logout Button - Desktop */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
            
            {/* Logout Button - Mobile */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;