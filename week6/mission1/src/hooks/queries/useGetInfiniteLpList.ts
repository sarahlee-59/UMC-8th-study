import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsByLpId } from "../../types/comment";

export const useInfiniteComments = (
  lpId: string,
  order: "asc" | "desc"
) => {
  return useInfiniteQuery({
    queryKey: ["comments", lpId, order],
    queryFn: ({ pageParam = 0 }) => getCommentsByLpId(lpId, pageParam, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};