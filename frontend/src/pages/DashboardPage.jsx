import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../redux/slices/adminSlice";
import {
  Grid,
  Package,
  Boxes,
  Loader2,
  BarChart3,
  Clock,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Pencil,
  ScanLine,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const COLOR_CLASSES = {
  indigo: {
    border: "border-indigo-600",
    text: "text-indigo-700",
    bg: "bg-indigo-100/70",
  },
  green: {
    border: "border-green-600",
    text: "text-green-700",
    bg: "bg-green-100/70",
  },
  // orange: { border: "border-orange-600", text: "text-orange-700", bg: "bg-orange-100/70" },
};

const StatCard = ({ title, value, IconComponent, color, navigateTo }) => {
  const classes = COLOR_CLASSES[color] || COLOR_CLASSES.indigo;
  const formattedValue = new Intl.NumberFormat().format(value);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(navigateTo)}
      className={`p-5 md:p-6 bg-white rounded-2xl shadow-md flex items-center justify-between transition duration-300 hover:cursor-pointer hover:shadow-xl border-l-4 ${classes.border}`}
    >
      <div>
        <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h2
          className={`text-2xl md:text-4xl font-extrabold text-gray-900 mt-1 ${classes.text}`}
        >
          {formattedValue}
        </h2>
      </div>
      <div className={`p-3 md:p-4 rounded-full ${classes.bg} shrink-0 ml-4`}>
        <IconComponent className={`h-6 w-6 md:h-7 md:w-7 ${classes.text}`} />
      </div>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, color, description, time }) => {
  return (
    <li className="flex items-start space-x-3 p-3== hover:bg-gray-50 rounded-xl transition duration-150 border-b border-gray-50 last:border-0">
      <div className={`p-2 rounded-full ${color.bg} mt-0.5 shrink-0`}>
        <Icon className={`h-4 w-4 ${color.text}`} />
      </div>
      <div className="grow min-w-0">
        <p className="text-sm text-gray-700 leading-snug wrap-break-words">
          {description}
        </p>
        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-tight">
          {time}
        </p>
      </div>
    </li>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin) || {};


  useEffect(() => {
    dispatch(fetchDashboardStats(localStorage.getItem("token")));
  }, [dispatch]);

  const [openScanner, setOpenScanner] = useState(false);

  const kpiData = [
    {
      id: 1,
      title: "Categories",
      value: stats?.totalCategories ?? 0,
      IconComponent: Grid,
      color: "indigo",
      navigateTo: "/admin/categories",
    },
    {
      id: 2,
      title: "Products",
      value: stats?.totalProducts ?? 0,
      IconComponent: Package,
      color: "green",
      navigateTo: "/admin/products",
    },
    // { id: 3, title: "Finishes", value: stats?.totalFinishes ?? 0, IconComponent: Boxes, color: "orange", navigateTo: "/admin/finishes" },
  ];

  const activityFeedData = [
    {
      icon: PlusCircle,
      color: { text: "text-green-600", bg: "bg-green-100" },
      description:
        "<b>+50 items</b> received into <span class='text-indigo-700 font-medium'>Warehouse A</span>",
      time: "1 hour ago",
    },
    {
      icon: AlertTriangle,
      color: { text: "text-red-600", bg: "bg-red-100" },
      description: "Product <b>'XYZ-123'</b> is out of stock",
      time: "3 hours ago",
    },
    {
      icon: Pencil,
      color: { text: "text-blue-600", bg: "bg-blue-100" },
      description: "Price updated for <b>'Premium Faucet'</b>",
      time: "Yesterday",
    },
  ];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="mt-4 text-lg font-medium text-gray-600">
          Syncing Inventory...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-6 text-center bg-red-50 rounded-2xl border border-red-200">
        <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-500" />
        <p className="font-bold text-lg text-red-800">Connection Error</p>
        <p className="text-sm text-red-600 mt-1">
          {error.message || "Please check your internet."}
        </p>
      </div>
    );
  }

  return (
    /* Reduced padding on mobile (p-4), kept p-8 for desktop */
    <div className="min-h-screen">
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg md:bg-transparent md:p-0">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-white md:text-indigo-600" />
          </div>
          Inventory
        </h1>
        <p className="text-gray-500 text-sm mt-1 ml-1">
          Real-time stock overview
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setOpenScanner(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            <ScanLine className="w-5 h-5" />
            Scan Product
          </button>
        </div>
      </header>

      {/* KPI Grid: 1 column on mobile, 3 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        {kpiData.map((kpi) => (
          <StatCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 uppercase tracking-tight">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Monthly Flow
          </h2>

          <div className="h-48 md:h-72 flex items-end justify-between gap-1 md:gap-2 px-2 pb-2 bg-gray-50/50 rounded-xl border border-gray-100 relative">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm md:rounded-t-md transition-all duration-500 ${
                  i % 3 === 0 ? "bg-indigo-500" : "bg-green-400"
                } hover:opacity-80`}
                style={{ height: `${Math.floor(Math.random() * 70) + 20}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[10px] text-gray-400 font-bold">JAN</span>
            <span className="text-[10px] text-gray-400 font-bold">JUN</span>
            <span className="text-[10px] text-gray-400 font-bold">DEC</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
            <Clock className="w-5 h-5 text-orange-500" />
            Updates
          </h2>

          <ul className="space-y-1">
            {activityFeedData.map((activity, index) => (
              <ActivityItem
                key={index}
                {...activity}
                description={
                  <span
                    dangerouslySetInnerHTML={{ __html: activity.description }}
                  />
                }
              />
            ))}
          </ul>
          <button className="w-full mt-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
            View All Activity
          </button>
        </div>
      </div>

      {openScanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpenScanner(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Scan Product QR
            </h2>

            <div className="overflow-hidden rounded-xl border">
              <BarcodeScannerComponent
                width="100%"
                height={300}
                onUpdate={(err, result) => {
                  if (result) {
                    const scannedText = result.text;

                    setOpenScanner(false);

                    // ✅ Redirect to URL inside QR
                    if (scannedText.startsWith("http")) {
                      window.open(scannedText, "_blank", "noopener,noreferrer");
                    }
                  }
                }}
              />
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Align the QR code within the frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
