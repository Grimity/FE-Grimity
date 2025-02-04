import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface TagsSearchResponse {
  id: string;
  title: string;
  thumbnail: string;
  likeCount: number;
  viewCount: number;
  isLike: boolean;
  author: {
    id: string;
    name: string;
  };
}

export async function getTagsSearch(tagNames: string): Promise<TagsSearchResponse[]> {
  try {
    const response = await BASE_URL.get("/tags/search", {
      params: { tagNames },
    });

    const data = response.data;

    const updatedData = data.map((item: TagsSearchResponse) => ({
      ...item,
      thumbnail: `https://image.grimity.com/${item.thumbnail}`,
      author: {
        ...item.author,
      },
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching TagsSearch:", error);
    throw new Error("Failed to fetch TagsSearch");
  }
}

export function useTagsSearch(tagNames: string) {
  return useQuery<TagsSearchResponse[]>(
    ["TagsSearch", tagNames],
    () => getTagsSearch(tagNames),
    {}
  );
}
