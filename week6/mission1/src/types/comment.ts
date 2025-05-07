import axios from "axios";
import { CursorBasedResponse } from "../types/common";

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
  const res = await axios.get(
    `http://localhost:8000/v1/lps/${lpId}/comments`,
    {
      params: {
        cursor,
        order,
        limit,
      },
    }
  );
  return res.data;
};