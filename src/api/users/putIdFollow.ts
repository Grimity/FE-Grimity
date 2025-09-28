import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface PutFollowParams {
  id: string;
}

export async function putFollow({ id }: PutFollowParams): Promise<void> {
  await axiosInstance.put(`/users/${id}/follow`, {
    id,
  });
  return;
}

export const usePutFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFollowings"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
