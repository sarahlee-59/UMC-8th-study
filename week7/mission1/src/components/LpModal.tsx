import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lp";

interface Props {
  onClose: () => void;
}

const LpModal = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose(); // 모달 닫기
    },
    onError: () => {
      alert("등록 실패 😢");
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState("");

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modal-background") {
      onClose();
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput(""); // 입력창 초기화
    }
  };

  const handleSubmit = () => {
    // 나중에 서버에 LP 등록 API를 연결할 곳
    console.log("LP 등록:", {
      title,
      content,
      thumbnail,
      tags,
    });
  };

  return (
    <div
      id="modal-background"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div className="bg-[#2c2c2c] p-8 rounded-xl w-[400px] text-white space-y-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          ×
        </button>

        {/* LP 이미지 업로드 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 bg-gray-700 rounded-full mx-auto flex items-center justify-center overflow-hidden cursor-pointer"
        >
          <img
            src={thumbnail || "/pngwing.com.png"}
            alt="LP"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setThumbnail(url); // 이미지 미리보기용 상태 변경
              }
            }}
          />
        </div>

        {/* LP Name */}
        <input
          type="text"
          placeholder="LP Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded border border-gray-500 bg-transparent text-white"
        />

        {/* LP Content */}
        <input
          type="text"
          placeholder="LP Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded border border-gray-500 bg-transparent text-white"
        />

        {/* LP Tag 입력 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 p-2 rounded border border-gray-500 bg-transparent text-white"
          />
          <button
            onClick={handleTagAdd}
            className="px-4 py-2 border border-gray-500 rounded text-white hover:bg-gray-600"
          >
            Add
          </button>
        </div>

        {/* 태그 목록 표시 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center px-2 py-1 rounded border border-gray-500 text-white text-sm"
            >
              {tag}
              <button
                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                className="ml-1 text-white hover:text-gray-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          disabled={!title.trim()} // 공백 입력은 제외
          onClick={handleSubmit}
          className={`w-full py-2 rounded text-white font-bold transition 
            ${
              title.trim()
                ? "bg-pink-500 hover:scale-95"
                : "bg-gray-600 cursor-not-allowed"
            }`}
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LpModal;
