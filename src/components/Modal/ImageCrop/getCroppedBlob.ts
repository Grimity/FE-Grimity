import type { PercentCrop } from "react-image-crop";

import type { CropOutputSize } from "./ImageCropModal.types";

/**
 * 화면에 보이는 자르기 영역(확대 반영)을 원본 해상도에서 잘라 webp Blob으로 돌려준다.
 * 이미지는 중앙을 기준으로 scale만큼 확대되어 있다고 가정한다.
 */
export function getCroppedBlob(
  image: HTMLImageElement,
  crop: PercentCrop,
  scale: number,
  output: CropOutputSize,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.imageSmoothingQuality = "high";

  const ratioX = image.naturalWidth / image.width;
  const ratioY = image.naturalHeight / image.height;

  // 자르기 영역(화면 px) → 확대 전 이미지 좌표(px)
  const cropX = (crop.x / 100) * image.width;
  const cropY = (crop.y / 100) * image.height;
  const cropWidth = (crop.width / 100) * image.width;
  const cropHeight = (crop.height / 100) * image.height;

  const sourceX = ((cropX - image.width / 2) / scale + image.width / 2) * ratioX;
  const sourceY = ((cropY - image.height / 2) / scale + image.height / 2) * ratioY;
  const sourceWidth = (cropWidth / scale) * ratioX;
  const sourceHeight = (cropHeight / scale) * ratioY;

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    output.width,
    output.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      "image/webp",
      0.9,
    );
  });
}
