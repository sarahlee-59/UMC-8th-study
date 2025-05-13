// user.ts
import { axiosInstance } from "./axios";
import { ResponseMyInfoDto } from "../types/auth";

interface UpdateMyInfoBody {
  name: string;
  bio?: string;
  avatar?: string;
}

export const updateMyInfo = async (body: UpdateMyInfoBody): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);
  return data;
};
