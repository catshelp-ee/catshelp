const createImageCanvas = (
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get 2D canvas context");

  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality = 0.8,
  type = "image/jpeg"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      type,
      quality
    );
  });
};

const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const resizeImage = async (
  file: File,
  width: number,
  height: number
): Promise<File> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const canvas = createImageCanvas(img, width, height);
  const blob = await canvasToBlob(canvas);

  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const newFileName = `${baseName}_${width}x${height}.jpg`;

  return new File([blob], newFileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

export const resizeImages = (images: File[]): Promise<File[]> => {
  const allResizePromises = images.flatMap(image => [
    resizeImage(image, 64, 64),
    resizeImage(image, 256, 256),
  ]);
  return Promise.all(allResizePromises);
};


export const isValidHyperlink = (link: string): boolean => {
  try {
    new URL(link);
    return true;
  } catch (_error) {
    return false;
  }
}

export const extractFileId = (link: string): string | null => {
  const match = link.match(/\/file\/d\/(.+?)\//);
  return match ? match[1] : null;
}