import { useEffect, useState } from "react";
import { getMyInfo, updateMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface FormState {
  name: string;
  bio?: string;
  avatar?: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await getMyInfo();
      setData(res);
      setForm({
        name: res.data.name || "",
        bio: res.data.bio || "",
        avatar: res.data.avatar || "",
      });
    };
    fetch();
  }, []);

  const mutation = useMutation<any, unknown, FormState>({
    mutationFn: updateMyInfo,
    onSuccess: async () => {
      const updated = await getMyInfo();
      setData(updated);
      setIsEditing(false);
      alert("정보가 수정되었습니다.");
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = () => {
    if (form.name.trim() === "") {
      alert("이름은 필수입니다.");
      return;
    }

    mutation.mutate({
      name: form.name,
      bio: form.bio || "",
      avatar: form.avatar || "",
    });
  };

  return (
    <div className="text-pink-500 text-xl flex flex-col items-center">
      {!isEditing && data?.data?.avatar && (
        <div className="mt-4 flex justify-center">
          <img
            src={data.data.avatar}
            alt="프로필 이미지"
            className="w-32 h-32 object-cover rounded-full border"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150?text=No+Image";
            }}
          />
        </div>
      )}
      <h1>{data?.data?.name}</h1>
      <h1>{data?.data?.bio}</h1>
      <h1>{data?.data?.email}</h1>
      <button
        onClick={handleLogout}
        className="rounded-xl bg-gray-700 p-3 mt-5 font-bold text-white hover:scale-90"
      >
        로그아웃
      </button>

      <button
        onClick={() => setIsEditing(true)}
        className="rounded-xl bg-blue-500 p-3 mt-3 font-bold text-white hover:scale-90"
      >
        설정
      </button>

      {isEditing && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-5 w-[300px] text-black">
          <label className="block mb-2">
            이름<span className="text-red-500">*</span>:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="w-full p-2 border"
            />
          </label>

          <label className="block mb-2">
            Bio:
            <input
              type="text"
              name="bio"
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full p-2 border"
            />
          </label>

          {/* 프로필 이미지 URL 입력 토글 */}
          <div className="mb-2">
            <button
              onClick={() => setShowAvatarInput((prev) => !prev)}
              className="text-blue-500 underline text-sm"
            >
              {showAvatarInput ? "사진 URL 입력 닫기" : "프로필 사진 URL 입력"}
            </button>
            {showAvatarInput && (
              <input
                type="text"
                name="avatar"
                value={form.avatar}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, avatar: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 border mt-2"
              />
            )}
          </div>
          {/* 프로필 이미지 미리보기 */}
          {form.avatar && (
            <div className="mt-4 flex justify-center">
              <img
                src={form.avatar}
                alt="미리보기"
                className="w-32 h-32 object-cover rounded-full border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white rounded p-2 mt-3 w-full"
          >
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white rounded p-2 mt-2 w-full"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
