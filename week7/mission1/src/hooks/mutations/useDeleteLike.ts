import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { Lp } from "../../types/lp";

function useDeleteLike(lpId: number, userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLike(lpId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] });
      const previous = queryClient.getQueryData([QUERY_KEY.lpDetail, lpId]) as Lp;

      queryClient.setQueryData([QUERY_KEY.lpDetail, lpId], (old: Lp | undefined) => {
        if (!old) return old;
        return {
          ...old,
          likes: old.likes.filter((like) => like.userId !== userId),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEY.lpDetail, lpId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] });
    },
  });
}

export default useDeleteLike;
