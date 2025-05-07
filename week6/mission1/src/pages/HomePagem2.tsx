import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import { PAGINATION_ORDER } from "../types/common";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data,
    isPending,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetInfiniteLpList(8, search, order);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [order, refetch]);

  return (
    <div className="px-4 py-8">
      <div className="flex justify-end gap-2 mb-6">
        <button onClick={() => setOrder(PAGINATION_ORDER.asc)}>오래된순</button>
        <button onClick={() => setOrder(PAGINATION_ORDER.desc)}>최신순</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.flatMap((page) =>
          page.data.data.map((lp) => <LpCard key={lp.id} lp={lp} />)
        )}

        {isFetching && <LpCardSkeletonList count={8} />}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default HomePage;
