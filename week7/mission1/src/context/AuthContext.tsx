// ✅ AuthContext.tsx - 로그인 상태 및 사용자 정보 관리
import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { RequestSigninDto } from "../types/auth";
import { postSignin, postLogout, getMyInfo } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

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
  logout(): Promise<void>;

  // ✅ setter 함수들 포함
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
  setUser: () => {},
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
  const [user, setUser] = useState<User | null>(null);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
      localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser({ id: data.id, name: data.name, email: signinData.email });

      alert("로그인 성공");
    } catch (err) {
      console.error("로그인 실패", err);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken && !user) {
        try {
          const res = await getMyInfo();
          setUser(res.data);
        } catch (err) {
          console.error("유저 정보 가져오기 실패", err);
        }
      }
    };
    fetchUser();
  }, [accessToken, user]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        setAccessToken,
        setRefreshToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
