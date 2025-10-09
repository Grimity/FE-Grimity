import React, { useState } from "react";
import Image from "next/image";

import styles from "./LazyImage.module.scss";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, width, height, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${styles.image} ${isLoaded ? styles.loaded : styles.loading}`}
          onLoad={handleLoad}
          onError={handleError}
        />
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
