import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Lp } from "../types/lp";
import CommentListSkeletonList from "../components/CommentCard/CommentListSkeletonList";
import CommentCard from "../components/CommentCard/CommentList";
import useGetInfiniteCommentsByLpId from "../hooks/queries/useGetInfiniteCommentsByLpId";
import CommentInput from "../components/CommentCard/CommentInput";


const fetchLpById = async (id: number): Promise<Lp> => {
  const response = await axios.get(`http://localhost:8000/v1/lps/${id}`);
  return response.data.data;
};

const LpDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  console.log("params.id", id);

  const getLpDetail = () => {
    return fetchLpById(Number(id!));
  };

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data: lp,
    isLoading: lpLoading,
    isError,
  } = useQuery({
    queryKey: ["lpDetail", id],
    queryFn: getLpDetail,
    enabled: !!id,
  });
  
  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading: commentLoading,
    refetch,
  } = useGetInfiniteCommentsByLpId(id!, order);

  const { ref, inView } = useInView();

  useEffect(() => {
    refetch();
  }, [order, refetch]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  //if (isError || !lp) {
   // return <div className="text-red-500">Error Occurred</div>;
  //}

  return (
    <div className="max-w-4xl text-white mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          돌아가기
        </button>
        <div className="flex gap-5">
          <button>수정</button>
          <button>삭제</button>
          <button>♡</button>
        </div>
      </div>

      <img
        src={lp?.thumbnail}
        alt={lp?.title}
        className="w-64 h-64 object-cover mx-auto"
      />
      <h2 className="text-2xl font-bold">{lp?.title}</h2>
      <p>{lp?.content}</p>

      {/* 댓글 정렬 토글 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder("asc")}
          className={`px-3 py-1 border rounded ${order === "asc" ? "bg-white text-black" : "bg-zinc-700 text-white"}`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`px-3 py-1 border rounded ${order === "desc" ? "bg-white text-black" : "bg-zinc-700 text-white"}`}
        >
          최신순
        </button>
      </div>

      <div className="space-y-4 mt-10 text-white">
  <div className="font-bold text-2xl">댓글</div>

  {/* ✅ 입력창은 항상 보여줍니다 */}
  <CommentInput />

  {/* ✅ 댓글 목록 */}
  {commentLoading ? (
    <CommentListSkeletonList count={5} />
  ) : (
    commentPages?.pages
      .flatMap((page) => page.data)
      .map((comment) => (
        <CommentCard
          key={comment.id}
          author={comment.author?.name}
          content={comment.content}
          createdAt={comment.createdAt}
        />
      ))
  )}

  {isFetching && <CommentListSkeletonList count={3} />}
  <div ref={ref} className="h-10" />
      </div>
    </div>
  );
};

export default LpDetailPage;
