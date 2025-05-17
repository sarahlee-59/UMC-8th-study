import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import useAuth from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUpdateNickname from "../hooks/mutations/useUpdateNickname";

interface FormState {
  name: string;
  bio?: string;
  avatar?: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, setUser } = useAuth(); // ✅ setUser 가져오기
  const updateNickname = useUpdateNickname();
  
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = () => {
    if (form.name.trim() === "") {
      alert("이름은 필수입니다.");
      return;
    }

    updateNickname.mutate(form, {
    onSuccess: async () => {
      const updated = await getMyInfo();
      setData(updated);
      setUser(updated.data); // ✅ Navbar까지 닉네임 갱신 반영
      setIsEditing(false);
      alert("정보가 수정되었습니다.");
    }});
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/v1/uploads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("accessToken")
              ?.replace(/^"|"$/g, "")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setForm((prev) => ({
        ...prev,
        avatar: res.data.data.imageUrl,
      }));
    } catch (err) {
      alert("이미지 업로드에 실패했습니다.");
    }
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

          <div className="mb-2">
            <label className="block mb-1">프로필 사진:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
              className="w-full p-2 border"
            />
          </div>

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
