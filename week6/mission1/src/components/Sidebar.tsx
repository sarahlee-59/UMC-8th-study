import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const nav = useNavigate();
    return (
        <div className="w-60 h-[calc(100vh-64px)] bg-[#202024] text-white p-4 shadow-lg flex flex-col items-start">
            <button className="mb-4 hover:text-pink-400 hover:cursor-pointer">🔍 찾기</button>
            
            <button onClick={() => nav('my')} className="mb-4 hover:text-pink-400 hover:cursor-pointer">👤 마이페이지</button>
        </div>
    );
};

export default Sidebar;