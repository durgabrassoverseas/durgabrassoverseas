import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Grid,
  Settings,
  ShoppingCart,
} from "lucide-react"; // Importing professional icons

const Sidebar = () => {
  // Define navigation items with Lucide icons
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Categories", icon: Grid, path: "/admin/categories" },
    { name: "Finishes", icon: Boxes, path: "/admin/finishes" },
    { name: "Products", icon: Package, path: "/admin/products" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white shadow-2xl flex flex-col">
      {/* 1. Branding Header */}
      <div className="h-16 flex items-center justify-center border-b border-indigo-700/50 bg-gray-900">
        <div className="text-xl font-extrabold text-indigo-400 tracking-wider flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          ADMIN PANEL
        </div>
      </div>

      {/* 2. Navigation Area */}
      <nav className="p-4 flex-1 overflow-y-auto space-y-1">
        {navItems.map((item, index) => {
          if (item.isSeparator) {
            return (
              <div
                key={`sep-${index}`}
                className="my-4 border-t border-gray-700/70 pt-2"
              />
            );
          }

          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200 ease-in-out group
    ${
      isActive
        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-5 h-5 mr-3 ${
                      isActive
                        ? "text-indigo-200"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 3. Optional Footer (e.g., Version Info) */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-700">
        Version 1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
