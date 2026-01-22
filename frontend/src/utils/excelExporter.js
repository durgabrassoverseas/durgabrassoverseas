import * as XLSX from 'xlsx';

export const exportProductsToExcel = (products) => {
  // 1️⃣ Flatten products to multiple rows if multiple sizes
  const excelData = products.flatMap((p) =>
    (p.itemSize?.length ? p.itemSize : [null]).map((size) => ({
      "Item Number": p.itemNumber || "—",
      "Product Name": p.name,
      "Category": p.category?.name || "—",
      "Finish": p.finish?.name || "—",
      "Price (USD)": p.price || 0,
      "Discount %": p.discountPercent || 0,
      "Weight (kg)": p.weight || "—",
      "Master Pack": p.masterPack || "—",

      // Item size per row
      "Item (L)": size?.length || "—",
      "Item (W)": size?.width || "—",
      "Item (H)": size?.height || "—",

      // Carton Size
      "Carton (L)": p.cartonSize?.length || "—",
      "Carton (W)": p.cartonSize?.width || "—",
      "Carton (H)": p.cartonSize?.height || "—",

      "Description": p.description || "",
    }))
  );

  // 2️⃣ Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 3️⃣ Set column widths
  const columnWidths = [
    { wch: 15 }, // Item Number
    { wch: 35 }, // Name
    { wch: 20 }, // Category
    { wch: 25 }, // Finish
    { wch: 12 }, // Price
    { wch: 12 }, // Discount
    { wch: 12 }, // Weight
    { wch: 12 }, // Master Pack
    { wch: 6 }, // Item Length
    { wch: 6 }, // Item Width
    { wch: 6 }, // Item Height
    { wch: 6 }, // Carton Length
    { wch: 6 }, // Carton Width
    { wch: 6 }, // Carton Height
    { wch: 40 }, // Description
  ];
  worksheet['!cols'] = columnWidths;

  // 4️⃣ Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products Catalog");

  // 5️⃣ Download file
  const fileName = `Products_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};


// import * as XLSX from 'xlsx';

// export const exportProductsToExcel = (products) => {
//   // 1. Prepare and flatten the data for Excel rows
//   const excelData = products.map((p) => ({
//     "Item Number": p.itemNumber || "—",
//     "Product Name": p.name,
//     "Category": p.category?.name || "—",
//     "Finish": p.finish?.name || "—",
//     "Price (USD)": p.price || 0,
//     "Discount %": p.discountPercent || 0,
//     "Weight (kg)": p.weight || "—",
//     "Master Pack": p.masterPack || "—",
//     // ✅ Separate Item Size columns
//     "Item Length": p.itemSize?.length || "—",
//     "Item Width": p.itemSize?.width || "—",
//     "Item Height": p.itemSize?.height || "—",
    
//     // Carton Size (already object)
//     "Carton Length": p.cartonSize?.length || "—",
//     "Carton Width": p.cartonSize?.width || "—",
//     "Carton Height": p.cartonSize?.height || "—",

//     "Description": p.description || "",
//   }));

//   // 2. Create a worksheet
//   const worksheet = XLSX.utils.json_to_sheet(excelData);

//   // 3. Set column widths for better readability
//   const columnWidths = [
//     { wch: 15 }, // Item Number
//     { wch: 35 }, // Name
//     { wch: 20 }, // Category
//     { wch: 25 }, // Finish
//     { wch: 12 }, // Price
//     { wch: 12 }, // Discount
//     { wch: 12 }, // Weight
//     { wch: 12 }, // Master Pack
//     { wch: 20 }, // Item Size
//     { wch: 20 }, // Carton Size
//     { wch: 40 }, // Description
//   ];
//   worksheet['!cols'] = columnWidths;

//   // 4. Create a workbook and append the worksheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Products Catalog");

//   // 5. Trigger download
//   const fileName = `Products_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
//   XLSX.writeFile(workbook, fileName);
// };