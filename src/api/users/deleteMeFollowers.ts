import axiosInstance from "@/constants/baseurl";

export async function deleteMyFollowers(id: string): Promise<void> {
  await axiosInstance.delete(`/users/me/followers/${id}`);
  return;
}
