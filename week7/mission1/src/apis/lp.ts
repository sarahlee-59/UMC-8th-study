import axios from "axios";
import { PaginationDto } from "../types/common";
import { LpListResponse, RequestLpDto, ResponseLikeLpDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLPList = async (params: PaginationDto): Promise<LpListResponse> => {
  const response = await axios.get("/v1/lps", { params });
  return response.data;
};

export const postLp = async (
  lpData: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
  },
  token: string
) => {
  const res = await axios.post(
    "http://localhost:8000/v1/lps",
    {
      ...lpData,
      published: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰 포함
      },
    }
  );

  return res.data.data;
};

export const postLike = async (lpId: number) => {
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.replace(/^"|"$/g, "");

  const response = await axios.post(
    `http://localhost:8000/v1/lps/${lpId}/likes`, // ✅ 정확한 경로로 수정
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};


export const deleteLike = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.replace(/^"|"$/g, "");

   const { data } = await axios.delete(`http://localhost:8000/v1/lps/${lpId}/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}