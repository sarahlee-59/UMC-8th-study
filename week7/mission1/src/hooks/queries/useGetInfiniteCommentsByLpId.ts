import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsByLpId } from "../../apis/comment";
import { CursorBasedResponse } from "../../types/common";
import { CommentResponse } from "../../types/comment";

const useGetInfiniteCommentsByLpId = (lpId: string, order: "asc" | "desc") => {
  return useInfiniteQuery<CursorBasedResponse<CommentResponse[]>, Error>({
    queryKey: ["comments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getCommentsByLpId(lpId, pageParam as number, order), // 👈 as number 단언
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined, // 👈 수정: .data 제거
    initialPageParam: 0,
  });
};

export default useGetInfiniteCommentsByLpId;
