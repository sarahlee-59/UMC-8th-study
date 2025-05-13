import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { Lp } from "../../types/lp";

function usePostLike(lpId: number, userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postLike(lpId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lpDetail, lpId] });
      const previous = queryClient.getQueryData([QUERY_KEY.lpDetail, lpId]) as Lp;

      queryClient.setQueryData([QUERY_KEY.lpDetail, lpId], (old: Lp | undefined) => {
        if (!old) return old;
        return {
          ...old,
          likes: [...old.likes, { userId, id: Date.now(), lpId }], // 가짜 like 객체
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

export default usePostLike;
