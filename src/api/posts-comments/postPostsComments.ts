import axiosInstance from "@/constants/baseurl";
import { CreatePostCommentRequest } from "@grimity/dto";

export async function postPostsComments({
  postId,
  parentCommentId,
  content,
  mentionedUserId,
}: CreatePostCommentRequest): Promise<void> {
  try {
    await axiosInstance.post("/post-comments", {
      postId,
      parentCommentId,
      content,
      mentionedUserId,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    throw new Error("Failed to post comment");
  }
}
