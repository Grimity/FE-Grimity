import styles from "./Similar.module.scss";
import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import Loader from "@/components/Layout/Loader/Loader";
import { SimilarProps } from "./Similar.types";
import { useTagsSearch } from "@/api/tags/getTagsSearch";
import Title from "@/components/Layout/Title/Title";

export default function Similar({ tagNames }: SimilarProps) {
  const { data: Data, isLoading } = useTagsSearch(tagNames);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Title>관련 작품</Title>
      {Data && (
        <div className={styles.cardList}>
          {Data.map((item) => (
            <SquareCard
              key={item.id}
              id={item.id}
              title={item.title}
              thumbnail={item.thumbnail}
              author={item.author}
              likeCount={item.likeCount}
              commentCount={item.commentCount}
              isLike={item.isLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
