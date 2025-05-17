import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../context/AuthContext";
import { postComment } from "../../apis/comment"; // ✅ API 함수가 있어야 함

interface CommentInputProps {
  lpId: string; // 어떤 LP에 댓글을 작성하는지 필요
}

const CommentInput = ({ lpId }: CommentInputProps) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const mutation = useMutation({
    mutationFn: (commentContent: string) =>
      postComment({ lpId, content: commentContent, token: accessToken! }),
    onSuccess: () => {
      setContent(""); // ✅ 입력창 초기화
      queryClient.invalidateQueries({ queryKey: ["comments", lpId], type: "all" }); // ✅ 댓글 다시 불러오기
    },
    onError: () => {
      alert("댓글 등록에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
  
    if (!accessToken) {
      alert("로그인 후 댓글을 작성할 수 있어요!");
      return;
    }
  
    mutation.mutate(content); // 이제 token은 확실히 있음
  };
  

  return (
    <div className="flex items-center gap-2 mb-6">
      <input
        type="text"
        placeholder="댓글을 입력해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-3 py-2 rounded border border-gray-600 bg-[#1f1f1f] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <button
        onClick={handleSubmit}
        className="bg-pink-500 text-white font-semibold px-4 py-2 rounded hover:bg-pink-600 cursor-pointer"
      >
        작성
      </button>
    </div>
  );
};

export default CommentInput;
