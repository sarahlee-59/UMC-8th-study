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
    body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);

    return data;
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