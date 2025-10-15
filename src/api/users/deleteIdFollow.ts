import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface DeleteFollowParams {
  id: string;
}

export async function deleteFollow({ id }: DeleteFollowParams): Promise<void> {
  await axiosInstance.delete(`/users/${id}/follow`);
  return;
}

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFollowings"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
