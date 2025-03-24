import axiosInstance from "@/constants/baseurl";

export async function deleteMe(): Promise<Response> {
  try {
    const response = await axiosInstance.delete("/users/me", {
      headers: {
        "is-delete-account": "true",
      },
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");

    return response.data;
  } catch (error) {
    throw error;
  }
}
