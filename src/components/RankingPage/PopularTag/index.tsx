import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";

import { useTagsPopular } from "@/api/tags/getTagsPopular";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import Title from "@/components/Layout/Title/Title";
import Tag from "./Tag/Tag";

import styles from "./PopularTag.module.scss";

export default function PopularTag() {
  const { data, isLoading } = useTagsPopular();
  useGlobalLoading(isLoading);

  if (isLoading) return null;

  return (
    <div className={styles.container}>
      <Title>인기 태그</Title>
      <Swiper spaceBetween={14} slidesPerView="auto" className={styles.swiper}>
        {data?.map((tag) => (
          <SwiperSlide key={tag.tagName} className={styles.slide}>
            <Link href={`/search?tab=feed&keyword=${tag.tagName}`}>
              <Tag tagName={tag.tagName} thumbnail={tag.thumbnail} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
