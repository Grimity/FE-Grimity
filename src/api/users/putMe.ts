import axiosInstance from "@/constants/baseurl";
import type {
  UpdateUserRequest,
  UpdateProfileConflictResponse,
  MyProfileResponse,
} from "@grimity/dto";
export type { UpdateUserRequest, UpdateProfileConflictResponse };

export function toProfileUpdatePayload(
  myData: MyProfileResponse,
  overrides: Partial<UpdateUserRequest>,
): UpdateUserRequest {
  return {
    name: myData.name,
    description: myData.description ?? "",
    url: myData.url,
    links: (myData.links ?? []).map((link) => ({ linkName: link.linkName, link: link.link })),
    ...overrides,
  };
}

export interface Response {
  success: boolean;
  message: string;
}

export async function putMyInfo({
  name,
  description,
  links,
  url,
}: UpdateUserRequest): Promise<void> {
  await axiosInstance.put("/me", {
    name,
    description,
    links,
    url,
  });
  return;
}
