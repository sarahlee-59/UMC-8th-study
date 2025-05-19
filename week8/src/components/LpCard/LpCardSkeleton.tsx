const LpCardSkeleton = () => {
  return (
    <div className="relative aspect-square min-h-[200px] rounded-lg overflow-hidden shadow-lg animate-pulse bg-gray-200 flex flex-col justify-between">
      {/* 썸네일 영역 (위) */}
      <div className="w-full h-3/5 bg-gray-300"></div>

      {/* 정보 영역 (아래) */}
      <div className="bg-black bg-opacity-75 p-2 flex flex-col gap-2">
        <div className="bg-gray-400 h-4 w-3/4 rounded-sm"></div>
        <div className="bg-gray-400 h-3 w-1/2 rounded-sm"></div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;
