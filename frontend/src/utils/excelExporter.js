import * as XLSX from 'xlsx';

export const exportProductsToExcel = (products) => {
  // 1. Prepare and flatten the data for Excel rows
  const excelData = products.map((p) => ({
    "Item Number": p.itemNumber || "—",
    "Product Name": p.name,
    "Category": p.category?.name || "—",
    "Finish": p.finish?.name || "—",
    "Price (USD)": p.price || 0,
    "Discount %": p.discountPercent || 0,
    "Weight (kg)": p.weight || "—",
    "Master Pack": p.masterPack || "—",
    "Item Dimensions (L×W×H)": `${p.itemSize?.length || 0}×${p.itemSize?.width || 0}×${p.itemSize?.height || 0}`,
    "Carton Dimensions (L×W×H)": `${p.cartonSize?.length || 0}×${p.cartonSize?.width || 0}×${p.cartonSize?.height || 0}`,
    "Description": p.description || "",
  }));

  // 2. Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 3. Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Item Number
    { wch: 35 }, // Name
    { wch: 20 }, // Category
    { wch: 25 }, // Finish
    { wch: 12 }, // Price
    { wch: 12 }, // Discount
    { wch: 12 }, // Weight
    { wch: 12 }, // Master Pack
    { wch: 20 }, // Item Size
    { wch: 20 }, // Carton Size
    { wch: 40 }, // Description
  ];
  worksheet['!cols'] = columnWidths;

  // 4. Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products Catalog");

  // 5. Trigger download
  const fileName = `Products_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};