// components/CommentCard/CommentInput.tsx
const CommentInput = () => {
    return (
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button className="bg-pink-500 text-white font-semibold px-4 py-2 rounded hover:bg-pink-600 cursor-pointer">
          작성
        </button>
      </div>
    );
  };
  
  export default CommentInput;
  