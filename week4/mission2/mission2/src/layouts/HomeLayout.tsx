import { Outlet } from "react-router-dom"; 

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="h-20 flex items-center justify-between px-6 bg-gray-900 text-white">
                <div className="text-pink-500 font-bold text-2xl">돌려돌려LP판</div>
                <div className="flex gap-2">
                    <button className="bg-black text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">로그인</button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition">회원가입</button>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;