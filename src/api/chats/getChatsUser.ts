import axiosInstance from "@/constants/baseurl";
import { UserBaseResponse } from "@grimity/dto";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface GetChatsUserRequest {
  chatId: string;
}

export const getChatsUser = async ({ chatId }: GetChatsUserRequest) => {
  const response = await axiosInstance.get<GetChatsUserRequest, AxiosResponse<UserBaseResponse>>(
    `/chats/${chatId}/user`,
  );

  return response.data;
};

export const useGetChatsUser = (request: GetChatsUserRequest) => {
  return useQuery({
    queryKey: ["chats", request.chatId, "user"],
    queryFn: () => getChatsUser(request),
    enabled: !!request.chatId,
  });
};
