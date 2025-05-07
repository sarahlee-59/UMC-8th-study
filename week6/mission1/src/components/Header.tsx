import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { accessToken, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h1 className="text-pink-500 text-2xl font-bold">돌려돌려LP판</h1>
      <div className="flex items-center gap-4">
        {/* 로그인 상태 */}
        {accessToken && user ? (
          <>
            <span>{user.email.split("@")[0]}님 반갑습니다.</span>
            <button onClick={handleLogout} className="text-white">로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="text-white">로그인</button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-pink-500 px-4 py-1 rounded text-white"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
