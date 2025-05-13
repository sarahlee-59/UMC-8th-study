// layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => { if (isSidebarOpen) setIsSidebarOpen(false); };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isSidebarOpen) setIsSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSidebarOpen]);

    const { setAccessToken, setRefreshToken, setUser } = useAuth();
    const navigate = useNavigate();

    // useMutation으로 로그아웃 처리
    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSuccess: () => {
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
        },
        onError: () => {
            alert("로그아웃 실패");
        },
    });

    // 이 핸들러를 Navbar에 전달
    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#161616]">
            <Navbar
                toggleSidebar={toggleSidebar}
                onLogout={handleLogout}
                isLoggingOut={logoutMutation.isPending}
            />
            {isSidebarOpen && window.innerWidth < 768 && (
                <div onClick={closeSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-40"/>
            )}
            <div className="relative flex flex-row flex-1">
                {isSidebarOpen && (
                    <div className="fixed top-0 left-0 z-50 md:static h-full">
                        <Sidebar />
                    </div>
                )}
                <main onClick={closeSidebar} className="flex-1 relative z-10 mt-10 text-pink-600 px-4">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default HomeLayout;
