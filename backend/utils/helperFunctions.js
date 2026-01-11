import slugify from "slugify";
import QRCode from "qrcode";

export const generateSlug = (name, itemNumber) => {
  return slugify(`${name}-${itemNumber}`, {
    lower: true,
    strict: true,
  });
};

// export const generateSlug = (name) =>
//   slugify(name, { lower: true, strict: true });

export const generateProductSKU = () =>
  "PRO-" + Math.random().toString(36).substring(2, 8).toUpperCase();

export const generateItemSKU = () =>
  "ITEM-" + Math.random().toString(36).substring(2, 10).toUpperCase();

export const generateQR = (data) => {
  return new Promise((resolve, reject) => {
    try {
      QRCode.toDataURL(data, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    } catch (error) {
      reject(error);
    }
  });
}