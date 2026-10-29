import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import Tag from "@/components/common/Tag/Tag/Tag";

import styles from "./RecommendTagsSlider.module.scss";

interface RecommendTag {
  tagName: string;
}

interface RecommendTagsSliderProps {
  tags: RecommendTag[];
}

export default function RecommendTagsSlider({ tags }: RecommendTagsSliderProps) {
  return (
    <div className={styles.slider}>
      <Swiper
        className={styles.swiper}
        modules={[FreeMode]}
        freeMode
        slidesPerView="auto"
        spaceBetween={8}
        grabCursor
      >
        {tags.map((tag) => (
          <SwiperSlide key={tag.tagName} className={styles.slide}>
            <Link
              href={`/search?tab=feed&keyword=${encodeURIComponent(tag.tagName)}&sort=latest`}
              className={styles.chipLink}
            >
              <Tag size="md" active={false}>{tag.tagName}</Tag>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.gradient} aria-hidden />
    </div>
  );
}
