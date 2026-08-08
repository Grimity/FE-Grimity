import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSave, putSave } from "@/api/feeds/putDeleteFeedsIdSave";

interface SaveMutationParams {
  id: string;
  isSaved: boolean;
}

export const useFeedsSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isSaved }: SaveMutationParams) =>
      isSaved ? deleteSave(id) : putSave(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["MySaveList"] });
    },
  });
};
