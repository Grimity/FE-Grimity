import axiosInstance from "@/constants/baseurl";

// 피드 하나 삭제
export async function deleteFeeds(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}`);
  return response.data;
}
