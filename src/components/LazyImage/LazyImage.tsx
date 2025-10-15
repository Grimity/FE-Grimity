import React, { useState } from "react";
import Image from "next/image";

import styles from "./LazyImage.module.scss";

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, width, height, className }) => {
  const [hasError, setHasError] = useState(false);

  const paddingTop = `${(height / width) * 100}%`;

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {!hasError && (
        <div className={styles.imageContainer} style={{ paddingTop }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className={styles.image}
            onError={handleError}
          />
        </div>
      )}

      {hasError && (
        <div className={styles.error}>
          <span>이미지를 불러올 수 없습니다</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
