import BASE_URL from "@/constants/baseurl";

export interface PresignedUrlRequest {
  type: "profile" | "feed" | "background" | "post" | "chat";
  ext: "jpg" | "jpeg" | "png" | "webp";
}

export interface PresignedUrlResponse {
  url: string;
  imageName: string;
}

export async function postPresignedUrl({
  type,
  ext,
}: PresignedUrlRequest): Promise<PresignedUrlResponse> {
  const response = await BASE_URL.post("/aws/image-upload-url", {
    type,
    ext,
  });
  return response.data;
}

export async function postPresignedUrls(
  requests: PresignedUrlRequest[],
): Promise<PresignedUrlResponse[]> {
  const response = await BASE_URL.post("/aws/image-upload-urls", requests);
  return response.data;
}
