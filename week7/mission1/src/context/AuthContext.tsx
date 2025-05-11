import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { RequestSigninDto } from "../types/auth";
import { useEffect } from "react";
import { getMyInfo } from "../apis/auth";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login(signinData: RequestSigninDto): Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [user, setUser] = useState<User | null>(null); // ✅ 여기 안에 있어야 함

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        // ✅ 여기서 user 정보를 직접 구성
        setUser({
          id: data.id,
          name: data.name,
          email: "", // 백엔드가 안 줄 경우 임시 처리
        });

        alert("로그인 성공");
        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 에러 발생", error);
      alert("로그인 실패");
      window.location.href = "/";
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null); // ✅ 로그아웃 시 유저도 제거
      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 오류", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken && !user) {
        try {
          const res = await getMyInfo(); // accessToken은 내부적으로 설정됨
          setUser(res.data); // { id, name, email }
        } catch (error) {
          console.error("유저 정보 가져오기 실패", error);
        }
      }
    };

    fetchUser();
  }, [accessToken, user]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};
