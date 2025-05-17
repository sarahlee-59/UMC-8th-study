import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../apis/auth";
import useAuth from "../context/AuthContext.tsx";

const Sidebar = () => {
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { setAccessToken, setRefreshToken, setUser } = useAuth();

    // 탈퇴 mutation
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // 로그아웃과 동일하게 상태 초기화
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            alert("탈퇴가 완료되었습니다.");
            nav("/"); // 홈으로 이동
        },
        onError: () => {
            alert("탈퇴에 실패했습니다.");
        }
    });

    const handleDelete = () => {
        setShowModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate();
        setShowModal(false);
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="w-60 h-[calc(100vh-64px)] bg-[#202024] text-white p-4 shadow-lg flex flex-col items-start">
            <button className="mb-4 hover:text-pink-400 hover:cursor-pointer">🔍 찾기</button>
            <button onClick={() => nav('my')} className="mb-4 hover:text-pink-400 hover:cursor-pointer">👤 마이페이지</button>
            <button
                onClick={handleDelete}
                className="mb-4 text-red-400 hover:text-red-600 hover:cursor-pointer"
            >
                🗑️ 탈퇴하기
            </button>

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <p className="mb-4 text-lg text-gray-800">정말 탈퇴하시겠습니까?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                {deleteMutation.isPending ? "탈퇴 중..." : "예"}
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
