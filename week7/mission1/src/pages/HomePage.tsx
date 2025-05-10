import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpModal from "../components/LpModal";

const fetchInfiniteLps = async ({ pageParam = 0, queryKey }: any) => {
    const [, sortOrder] = queryKey; // ✅ 이름 충돌 방지
    const mappedOrder = sortOrder === "latest" ? "desc" : "asc"; // ✅ 새 변수명 사용
  
    const response = await axios.get("http://localhost:8000/v1/lps", {
      params: {
        cursor: pageParam,
        limit: 12,
        order: mappedOrder, // 이제 안전하게 사용 가능
      },
    });
  
    return {
      data: response.data.data.data,
      nextCursor: response.data.data.nextCursor,
      hasNext: response.data.data.hasNext,
    };
  };

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // 감시 대상 DOM 설정
  const { ref, inView } = useInView({ threshold: 0 });

  // useInfiniteQuery로 무한스크롤 데이터 요청
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["lpList", sortOrder],
    queryFn: fetchInfiniteLps,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  // inView가 true일 때 다음 페이지 요청
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isPending) return <div className="text-red-500">로딩 중...</div>;
  if (isError) return <div className="text-red-500">에러 발생</div>;

  // 모든 페이지의 lp 데이터를 펼치고 정렬
  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  const sortedData = [...lps].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex gap-2 justify-end">
        <button
          onClick={() => setSortOrder("oldest")}
          className={`cursor-pointer px-4 py-2 rounded border font-bold ${
            sortOrder === "oldest"
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setSortOrder("latest")}
          className={`cursor-pointer px-4 py-2 rounded border font-bold ${
            sortOrder === "latest"
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          최신순
        </button>
        {/* + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-pink-500 text-white text-3xl shadow-lg"
      >
        +
      </button>

      {/* 모달 */}
      {isModalOpen && <LpModal onClose={() => setIsModalOpen(false)} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {sortedData.map((lp) => (
      <LpCard key={lp.id} lp={lp} />
      ))}
      {isFetching && <LpCardSkeletonList count={12} />}
    </div>

      {/* 무한스크롤 감시용 ref */}
      <div ref={ref} className="h-10" />
      {isFetching && <div className="text-center mt-4">추가 로딩 중...</div>}
    </div>
  );
};

export default HomePage;
