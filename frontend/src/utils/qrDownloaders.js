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

const drawImageContain = (ctx, img, x, y, boxWidth, boxHeight) => {
  const imgRatio = img.width / img.height;
  const boxRatio = boxWidth / boxHeight;

  let drawWidth, drawHeight;

  if (imgRatio > boxRatio) {
    drawWidth = boxWidth;
    drawHeight = boxWidth / imgRatio;
  } else {
    drawHeight = boxHeight;
    drawWidth = boxHeight * imgRatio;
  }

  const offsetX = x + (boxWidth - drawWidth) / 2;
  const offsetY = y + (boxHeight - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

export const downloadQR = async (product) => {
  const qrValue = `${import.meta.env.VITE_QR_BASE_URL}/${product.slug}/${product.itemNumber}`;

  try {
    const size = 900;
    const padding = 50;
    const headerHeight = 120;
    const footerHeight = 100;

    const rightImage = await loadImageSafe(product.imageURL, demoImg);

    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrValue, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
    });

    const canvas = document.createElement("canvas");
    canvas.width = size * 2 + padding * 3;
    canvas.height = size + headerHeight + footerHeight + padding * 3;

    const ctx = canvas.getContext("2d");

    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Header - Company Name
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 70px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DURGA BRASS OVERSEAS", canvas.width / 2, headerHeight / 2 + 10);

    // Decorative line under header
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding * 2, headerHeight + 10);
    ctx.lineTo(canvas.width - padding * 2, headerHeight + 10);
    ctx.stroke();

    // QR Code
    const qrY = headerHeight + padding;
    ctx.drawImage(qrCanvas, padding, qrY, size, size);

    // QR Label
    ctx.fillStyle = "#555555";
    ctx.font = "600 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scan Me", padding + size / 2, qrY + size + 35);

    // Product Image with shadow
    const imgX = size + padding * 2;
    const imgY = qrY;

    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(imgX - 5, imgY - 5, size + 10, size + 10);

    ctx.shadowColor = "transparent";
    drawImageContain(ctx, rightImage, imgX, imgY, size, size);

    // Product Image Label
    ctx.fillStyle = "#555555";
    ctx.font = "600 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Product Image", imgX + size / 2, imgY + size + 35);

    // Footer - Item Number
    const footerY = canvas.height - footerHeight / 2 - 10;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 65px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Item No: ${product.itemNumber}`, canvas.width / 2, footerY);

    // Download
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `durga-brass-${product.slug}-${product.itemNumber}.png`;
    link.click();
  } catch (err) {
    console.error("QR generation failed:", err);
    alert("Failed to generate QR code");
  }
};

export const downloadAllQRsZip = async (products) => {
  if (!products?.length) return;

  const zip = new JSZip();
  const folder = zip.folder("durga-brass-qr-codes");

  try {
    const size = 900;
    const padding = 50;
    const headerHeight = 120;
    const footerHeight = 100;

    for (const product of products) {
      const qrValue = `${import.meta.env.VITE_QR_BASE_URL}/${product.slug}/${product.itemNumber}`;

      const rightImage = await loadImageSafe(product.imageURL, demoImg);

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, qrValue, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      const canvas = document.createElement("canvas");
      canvas.width = size * 2 + padding * 3;
      canvas.height = size + headerHeight + footerHeight + padding * 3;

      const ctx = canvas.getContext("2d");

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#f8f9fa");
      gradient.addColorStop(1, "#ffffff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

      // Header
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 70px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DURGA BRASS OVERSEAS", canvas.width / 2, headerHeight / 2 + 10);

      // Decorative line
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padding * 2, headerHeight + 10);
      ctx.lineTo(canvas.width - padding * 2, headerHeight + 10);
      ctx.stroke();

      // QR Code
      const qrY = headerHeight + padding;
      ctx.drawImage(qrCanvas, padding, qrY, size, size);

      ctx.fillStyle = "#555555";
      ctx.font = "600 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Scan Me", padding + size / 2, qrY + size + 35);

      // Product Image
      const imgX = size + padding * 2;
      const imgY = qrY;

      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(imgX - 5, imgY - 5, size + 10, size + 10);

      ctx.shadowColor = "transparent";
      drawImageContain(ctx, rightImage, imgX, imgY, size, size);

      ctx.fillStyle = "#555555";
      ctx.font = "600 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Product Image", imgX + size / 2, imgY + size + 35);

      // Footer
      const footerY = canvas.height - footerHeight / 2 - 10;
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 65px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Item No: ${product.itemNumber}`, canvas.width / 2, footerY);

      const base64 = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");

      folder.file(`${product.slug}-${product.itemNumber}.png`, base64, {
        base64: true,
      });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "durga-brass-qr-codes.zip");
  } catch (err) {
    console.error("Bulk QR generation failed:", err);
    alert("Failed to generate QR ZIP");
  }
};
