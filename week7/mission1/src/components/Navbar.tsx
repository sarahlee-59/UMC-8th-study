import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const Navbar = ({ toggleSidebar, onLogout, isLoggingOut }: NavbarProps) => {
  const { accessToken, user } = useAuth(); // ✅ 전역 상태에서 user 가져오기
  const nav = useNavigate();

  return (
    <div className="flex justify-between items-center px-5 py-3 h-15 bg-[#202024]">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-pink-500 text-4xl font-bold hover:cursor-pointer hover:text-pink-700"
        >
          ≡
        </button>
        <button
          onClick={() => nav('')}
          className="text-2xl font-bold text-pink-600 cursor-pointer"
        >
          돌려돌려LP판
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => nav('search')} className="py-2 hover:cursor-pointer">
          🔍
        </button>

        {!accessToken && (
          <>
            <button
              onClick={() => nav('login')}
              className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer"
            >
              로그인
            </button>
            <button
              onClick={() => nav('signup')}
              className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer"
            >
              회원가입
            </button>
          </>
        )}

        {accessToken && (
          <>
            <p className="pt-2 pr-2 text-pink-500">{user?.name}님 반갑습니다.</p>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
