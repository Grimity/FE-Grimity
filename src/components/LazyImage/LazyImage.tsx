import React, { useState } from "react";

import { useInView } from "react-intersection-observer";

import styles from "./LazyImage.module.scss";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={`${styles.container} ${className || ""}`}>
      {inView && (
        <>
          {!isLoaded && (
            <div className={styles.placeholder}>
              {placeholder || <div className={styles.skeleton} />}
            </div>
          )}
          {!hasError && (
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={`${styles.image} ${isLoaded ? styles.loaded : styles.loading}`}
              onLoad={handleLoad}
              onError={handleError}
              loading="lazy"
            />
          )}
          {hasError && (
            <div className={styles.error}>
              <span>이미지를 불러올 수 없습니다</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;
