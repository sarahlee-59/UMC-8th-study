import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { RequestSigninDto } from "../types/auth";
interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login(signinData: RequestSigninDto): Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null, 
    refreshToken: null,
    login: async() => {},
    logout: async() => {},
});

export const AuthProvider = ({children}:PropsWithChildren) => {
    const {getItem:getAccessTokenFromStorage, setItem:setAccessTokenInStorage, removeItem:removeAccessTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {getItem:getRefreshTokenFromStorage, setItem:setRefreshTokenInStorage, removeItem:removeRefreshTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(), 
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    const login = async(signinData:RequestSigninDto) => {
        try {
            const {data} = await postSignin(signinData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                // 강제로 set 함수를 통해 리렌더링을 유발시키지 않으면 값이 변경되지 않음
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공"); 
                window.location.href="/my"; 
            }; 
        } catch (error) {
            console.error("로그인 에러 발생", error);
            alert("로그인 실패");
            window.location.href="/"; 
        }
    };

    const logout = async() => {
        try {
            await postLogout(); 
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
        } catch (error) {
            console.error("로그아웃 오류", error); 
        }
    };

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    ); 
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}