import axiosInstance from "@/constants/baseurl";

export interface EditPostsRequest {
  title: string;
  content: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
}

export async function putEditPosts(
  id: string,
  { title, content, type }: EditPostsRequest,
): Promise<Response> {
  const response = await axiosInstance.put(`/posts/${id}`, {
    title,
    content,
    type,
  });
  return response.data;
}
