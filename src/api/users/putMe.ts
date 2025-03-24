import axiosInstance from "@/constants/baseurl";

export interface MyInfoRequest {
  name: string;
  description: string;
  links: { linkName: string; link: string }[];
  url: string;
}

export interface Response {
  success: boolean;
  message: string;
}

export interface UpdateProfileConflictResponse {
  statusCode: number;
  message: string;
}

export async function putMyInfo({
  name,
  description,
  links,
  url,
}: MyInfoRequest): Promise<Response> {
  const response = await axiosInstance.put("/users/me", {
    name,
    description,
    links,
    url,
  });
  return response.data;
}
