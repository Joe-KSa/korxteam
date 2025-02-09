import { useEffect, useState } from "react";

const useDominantColor = (imageUrl: string) => {
  const [dominantColor, setDominantColor] = useState<string>("");

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorMap: Record<string, number> = {};

      let maxCount = 0;
      let mostFrequentColor = "";

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const color = `${r},${g},${b}`;

        colorMap[color] = (colorMap[color] || 0) + 1;

        if (colorMap[color] > maxCount) {
          maxCount = colorMap[color];
          mostFrequentColor = color;
        }
      }

      setDominantColor(`rgb(${mostFrequentColor})`);
    };
  }, [imageUrl]);

  return dominantColor;
};

export default useDominantColor;