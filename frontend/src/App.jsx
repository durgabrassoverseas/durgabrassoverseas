import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { Toaster } from "react-hot-toast";

// import ItemsPage from "./pages/ItemsPage";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserItemPage from "./pages/User/UserItemPage";
// import FinishPage from "./pages/FinishPage";
import CataloguePage from "./pages/CataloguePage";

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>

        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/:slug/:itemNumber" element={<UserItemPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          {/* <Route path="finishes" element={<FinishPage />} /> */}
          <Route path="categories" element={<CategoryPage />} />
          <Route path="catalogue" element={<CataloguePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
