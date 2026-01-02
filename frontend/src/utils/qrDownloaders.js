import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import demoImg from "../assets/demoImg.png";


const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const loadImageSafe = async (src, fallback) => {
  try {
    if (!src) throw new Error("No image src");
    return await loadImage(src);
  } catch {
    return await loadImage(fallback);
  }
};


export const downloadQR = async (product) => {
  const qrValue = `${import.meta.env.VITE_QR_BASE_URL}/${product.slug}/${product.itemNumber}`;

  try {
    const size = 900;
    const padding = 40;
    const textHeight = 80;

    // 1️⃣ Load product image
    const rightImage = await loadImageSafe(product.imageURL, demoImg);

    // 2️⃣ QR canvas
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrValue, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    // 3️⃣ Final canvas
    const canvas = document.createElement("canvas");
    canvas.width = size * 2 + padding * 3;
    canvas.height = size + textHeight + padding * 2;

    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR
    ctx.drawImage(qrCanvas, padding, padding, size, size);

    // Product image
    ctx.drawImage(
      rightImage,
      size + padding * 2,
      padding,
      size,
      size
    );

    // Text
    ctx.fillStyle = "#000000";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `Item No: ${product.itemNumber}`,
      canvas.width / 2,
      canvas.height - textHeight / 2
    );

    // Download
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${product.slug}-${product.itemNumber}-qr.png`;
    link.click();
  } catch (err) {
    console.error("QR generation failed:", err);
  }
};

export const downloadAllQRsZip = async (products) => {
  if (!products?.length) return;

  const zip = new JSZip();
  const folder = zip.folder("product-qrs");

  try {
    const size = 900;
    const padding = 40;
    const textHeight = 80;

    for (const product of products) {
      const qrValue = `${import.meta.env.VITE_QR_BASE_URL}/${product.slug}/${product.itemNumber}`;

      // 1️⃣ Load product image
      const rightImage = await loadImageSafe(product.imageURL, demoImg);

      // 2️⃣ QR canvas
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, qrValue, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      // 3️⃣ Final canvas
      const canvas = document.createElement("canvas");
      canvas.width = size * 2 + padding * 3;
      canvas.height = size + textHeight + padding * 2;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(qrCanvas, padding, padding, size, size);
      ctx.drawImage(
        rightImage,
        size + padding * 2,
        padding,
        size,
        size
      );

      ctx.fillStyle = "#000000";
      ctx.font = "bold 80px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `Item No: ${product.itemNumber}`,
        canvas.width / 2,
        canvas.height - textHeight / 2
      );

      const base64 = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");

      folder.file(
        `${product.slug}-${product.itemNumber}.png`,
        base64,
        { base64: true }
      );
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "product-qr-codes.zip");
  } catch (err) {
    console.error("Bulk QR generation failed:", err);
    alert("Failed to generate QR ZIP");
  }
};
