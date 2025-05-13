// ✅ AuthContext.tsx - 사용자 인증 상태를 전역으로 관리하는 Context
import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { getMyInfo, postSignin, postLogout } from "../apis/auth";
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken)
  );
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const { data } = await postSignin({ email, password });
    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, data.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, data.refreshToken);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser({ id: data.id, name: data.name, email });
  };

  const logout = async () => {
    await postLogout();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken && !user) {
        try {
          const res = await getMyInfo();
          setUser(res.data);
        } catch (err) {
          console.error("사용자 정보 불러오기 실패", err);
        }
      }
    };
    fetchUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        setUser,
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}