import axios from "axios";
import { CursorBasedResponse } from "../types/common";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export const getCommentsByLpId = async (
  lpId: string,
  cursor: number,
  order: "asc" | "desc",
  limit = 10
): Promise<CursorBasedResponse<CommentResponse[]>> => {
  const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = rawToken?.replace(/^"|"$/g, "");

  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const res = await axios.get(
    `http://localhost:8000/v1/lps/${lpId}/comments`,
    {
      params: {
        cursor,
        order,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return res.data.data;
};

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
