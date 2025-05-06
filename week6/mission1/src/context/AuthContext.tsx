import { RequestSigninDto } from "../types/auth.ts";
import { createContext, PropsWithChildren, useState, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { postLogout, postSignin } from "../apis/auth.ts";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
    user: {email:string} | null;
}

export const AuthContext = createContext<AuthContextType>( {
    accessToken: null,
    refreshToken: null,
    login: async () => { },
    logout: async () => { },
    user: null
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { 
        getItem:getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [user, setUser] = useState<{email:string} | null>(null);

    const [accessToken, setAccessToken] = useState<string | null> (
        getAccessTokenFromStorage(),
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );
    const login = async(signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);

            if (data?.accessToken && data?.refreshToken) {
                const newAccessToken : string = data.accessToken;
                const newRefreshToken : string = data.refreshToken;
        
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                setUser({email: signinData.email});
                
                alert("로그인 성공");   
                window.location.href = "/my";

            }
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
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
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value = {{accessToken, refreshToken, login, logout, user}}>
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