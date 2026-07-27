"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Thumbs, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import Icon from "@/components/common/Icon/Icon";
import GNB from "@/components/common/Navigation/GNB/GNB";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { useDeviceStore } from "@/states/deviceStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import { downloadImage } from "@/utils/downloadImage";

import { ImageViewerProps } from "./ImageViewer.types";
import { useImageZoom } from "./useImageZoom";
import { useEscapeAndBackClose } from "./useEscapeAndBackClose";
import styles from "./ImageViewer.module.scss";

const MAX_SCALE = 3;

export default function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const { isMobile } = useDeviceStore();
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [downloading, setDownloading] = useState(false);

  // PC 전용 단계 줌(버튼) + pan. 모바일은 Swiper Zoom 사용
  const zoom = useImageZoom({ max: MAX_SCALE });

  const hasMultiple = images.length > 1;

  usePreventScroll(true);
  const close = useEscapeAndBackClose(onClose);

  // PC: 확대 중 Swiper 슬라이드 스와이프 잠금
  useEffect(() => {
    if (isMobile || !mainSwiper || mainSwiper.destroyed) return;
    mainSwiper.allowTouchMove = !zoom.isZoomed;
  }, [isMobile, mainSwiper, zoom.isZoomed]);

  const handleDownload = useCallback(async () => {
    const src = images[activeIndex];
    if (!src || downloading) return;
    setDownloading(true);
    try {
      await downloadImage(src);
    } finally {
      setDownloading(false);
    }
  }, [images, activeIndex, downloading]);

  if (images.length === 0) return null;

  const thumbsConfig = thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null;

  const renderThumbnails = (slideClassName: string, containerClassName: string) => (
    <div className={containerClassName} onClick={(e) => e.stopPropagation()}>
      <Swiper
        className={styles.thumbs}
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView="auto"
        spaceBetween={8}
        watchSlidesProgress
        centerInsufficientSlides
      >
        {images.map((image, i) => (
          <SwiperSlide key={`thumb-${image}-${i}`} className={slideClassName}>
            <ResponsiveImage
              src={image}
              alt=""
              className={styles.thumbImage}
              mobileSize={128}
              desktopSize={128}
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  // ===========================================================
  // 모바일: 상단 GNB(닫기·다운로드) + 풀블리드 이미지(핀치 줌)
  // ===========================================================
  if (isMobile) {
    return (
      <div className={styles.mobileOverlay} role="dialog" aria-modal="true" aria-label="이미지 뷰어">
        <GNB
          variant="image-viewer"
          className={styles.mobileGnb}
          onClose={close}
          onDownload={handleDownload}
        />
        <div className={styles.mobileBody}>
          <Swiper
            className={styles.mobileMain}
            modules={[Zoom, Thumbs, Keyboard]}
            initialSlide={initialIndex}
            zoom={{ maxRatio: MAX_SCALE }}
            keyboard={{ enabled: true }}
            thumbs={{ swiper: thumbsConfig }}
            onSwiper={setMainSwiper}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          >
            {images.map((image, i) => (
              <SwiperSlide key={`${image}-${i}`} className={styles.mobileSlide}>
                <div className={clsx("swiper-zoom-container", styles.mobileZoom)}>
                  <img
                    src={image}
                    alt=""
                    className={styles.mobileImage}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {hasMultiple && renderThumbnails(styles.mobileThumbSlide, styles.mobileThumbnails)}
      </div>
    );
  }

  // ===========================================================
  // PC: 이미지 + 하단 툴바(줌인/아웃/다운로드) + 썸네일
  // ===========================================================
  return (
    <div
      className={styles.overlay}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 뷰어"
    >
      <Swiper
        className={styles.main}
        modules={[Thumbs, Keyboard]}
        initialSlide={initialIndex}
        keyboard={{ enabled: true }}
        thumbs={{ swiper: thumbsConfig }}
        onSwiper={setMainSwiper}
        onSlideChange={(s) => {
          setActiveIndex(s.activeIndex);
          zoom.reset();
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={`${image}-${i}`} className={styles.slide}>
            <img
              src={image}
              alt=""
              className={styles.image}
              draggable={false}
              style={i === activeIndex ? zoom.imageStyle : undefined}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
              {...zoom.panHandlers}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.toolbar} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={zoom.zoomIn}
          disabled={!zoom.canZoomIn}
          aria-label="확대"
        >
          <Icon name="plus" size={24} color="white" />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={zoom.zoomOut}
          disabled={!zoom.canZoomOut}
          aria-label="축소"
        >
          <Icon name="minus" size={24} color="white" />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={handleDownload}
          disabled={downloading}
          aria-label="다운로드"
        >
          <Icon name="down" size={24} color="white" />
        </button>
      </div>

      {hasMultiple && renderThumbnails(styles.thumbSlide, styles.thumbnails)}
    </div>
  );
}
