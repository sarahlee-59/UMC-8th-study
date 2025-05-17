import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpModal from "../components/LpModal";
import useDebounce from "../hooks/useDebounce";

const fetchInfiniteLps = async ({ pageParam = 0, queryKey }: any) => {
  const [, sortOrder, keyword] = queryKey;
  const mappedOrder = sortOrder === "latest" ? "desc" : "asc";

  const response = await axios.get("http://localhost:8000/v1/lps", {
    params: {
      cursor: pageParam,
      limit: 12,
      order: mappedOrder,
      search: keyword
    },
  });

  return {
    data: response.data.data.data,
    nextCursor: response.data.data.nextCursor,
    hasNext: response.data.data.hasNext,
  };
};

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ["lpList", sortOrder, debouncedSearch],
    queryFn: fetchInfiniteLps,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      console.log("📦 fetchNextPage 실행");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isPending) return <div className="text-red-500">로딩 중...</div>;
  if (isError) return <div className="text-red-500">에러 발생</div>;

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredData = lps.filter(lp =>
    lp.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    lp.content.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={handleSearchChange}
        className="px-4 py-2 border rounded w-full max-w-xs mb-4"
      />

      {/* 정렬 버튼 */}
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
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {sortedData.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
        {isFetching && <LpCardSkeletonList count={12} />}
      </div>

      {/* 무한스크롤 감시 ref */}
      <div className="pb-40">
        <div ref={ref} className="h-10" />
      </div>
      {isFetching && <div className="text-center mt-4">추가 로딩 중...</div>}

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
  );
};

export default HomePage;