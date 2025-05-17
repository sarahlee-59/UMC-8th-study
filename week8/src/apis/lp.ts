import axios from "axios";
import { CursorBasedResponse } from "../types/common";
import { Lp, ResponseLikeLpDto } from "../types/lp";

export const getLpList = async (
  cursor: number,
  order: "latest" | "oldest",
  limit = 8,
  keyword = ""
): Promise<CursorBasedResponse<Lp[]>> => {
  const res = await axios.get("http://localhost:8000/v1/lps", {
    params: { cursor, order, limit, keyword },
  });
  return res.data.data;
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

export const getLikedLps = async (userId: number) => {
  const res = await axios.get(
    `/v1/users/${userId}/likes`
    );
  return res.data.data;
};

export const getMyLps = async (userId: number) => {
  const res = await axios.get(
    `/v1/users/${userId}/lps`
  );
  return res.data.data;
};