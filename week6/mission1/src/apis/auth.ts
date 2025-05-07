import { 
    RequestSigninDto, 
    RequestSignupDto,
    ResponseMyInfoDto,
    ResponseSigninDto, 
    ResponseSignupDto,
} from "../types/auth.ts";
import { axiosInstance } from "./axios.ts";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const postSignup = async (
    body: RequestSignupDto
): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);

    return data;
};

export const postSignin = async (
    body: RequestSigninDto
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    console.log("로그인 성공:", data);
    return data; // 서버에서 받은 data가 ResponseSigninDto 타입이어야 함
};

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
};

export const postLogout = async() => {
    const {data} = await axiosInstance.post("/v1/auth/signout");
    return data;
}

export const isLoggedIn = () : boolean => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    return !!token;
}
