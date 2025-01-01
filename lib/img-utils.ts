export async function downloadImageAsPng(url: string) {
  // Fetch the image
  const response = await fetch(url);
  const blob = await response.blob();

  // Create an image element and load the blob
  const img = new Image();
  const blobUrl = URL.createObjectURL(blob);

  return new Promise<Blob>((resolve, reject) => {
    img.onload = () => {
      // Create a canvas to draw and convert the image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      // Convert to PNG
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          resolve(pngBlob);
        } else {
          reject(new Error("Failed to convert image to PNG"));
        }
      }, "image/png");

      // Clean up
      URL.revokeObjectURL(blobUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = blobUrl;
  });
}
