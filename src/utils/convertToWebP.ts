export const convertToWebP = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            resolve(webpFile);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        },
        "image/webp",
        0.9,
      );
    };
    img.onerror = () => reject(new Error("Image loading failed"));
  });
};
