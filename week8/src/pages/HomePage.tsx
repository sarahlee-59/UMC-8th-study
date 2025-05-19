import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpModal from "../components/LpModal";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";

const fetchInfiniteLps = async ({ pageParam = 0 }: any) => {
  const response = await axios.get("http://localhost:8000/v1/lps", {
    params: {
      cursor: pageParam,
      limit: 12,
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
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const throttledSearch = useThrottle(debouncedSearch, 300);

  const { ref, inView } = useInView({
    threshold: 1.0,
    rootMargin: "200px",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpList"],
    queryFn: fetchInfiniteLps,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  const filteredData = lps.filter(
    (lp) =>
      lp.title.toLowerCase().includes(throttledSearch.toLowerCase()) ||
      lp.content.toLowerCase().includes(throttledSearch.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
  });

  const throttledInView = useThrottle(inView, 1000);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
  }, [throttledInView, hasNextPage, isFetchingNextPage]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🔍 검색창 */}
      <div className="mb-4 flex justify-between items-center pt-10">
        <div>
          <input
            className="outline-1 px-2 py-1 focus:outline-fuchsia-500 focus:text-fuchsia-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색어를 입력"
          />
        </div>
        {/* 정렬 */}
        <div className="flex gap-2">
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
      </div>

      {/* LP 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-5">
        {sortedData.map((lp, index) => {
  const isLast = index === sortedData.length - 1;
  return (
    <div key={lp.id} ref={isLast ? ref : undefined}>
      <LpCard lp={lp} />
    </div>
  );
})}

        {isFetchingNextPage && <LpCardSkeletonList count={12} />}
      </div>

      {/* LP 작성 모달 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-pink-500 text-white text-3xl shadow-lg"
      >
        +
      </button>

      {isModalOpen && <LpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;