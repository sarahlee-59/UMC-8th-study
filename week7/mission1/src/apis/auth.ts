import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post("/v1/auth/signup", body, );

    return data;
}; 

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post("/v1/auth/signin", body, );

    return data;
}; 

export const getMyInfo = async () => {
  const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = rawToken?.replace(/^"|"$/g, "");

  const res = await axios.get("http://localhost:8000/v1/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { data: { id, name, email } }
};

export const postLogout = async() => {

    const {data}= await axiosInstance.post("/v1/auth/signout"); 
    return data; 
};