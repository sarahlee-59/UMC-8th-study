// apis/comment.ts
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { CursorBasedResponse } from "../types/common";
import { CommentResponse } from "../types/comment";

export const getCommentsByLpId = async (
  lpId: string,
  cursor: number,
  order: "asc" | "desc",
  limit = 10
): Promise<CursorBasedResponse<CommentResponse[]>> => {
  const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = rawToken?.replace(/^"|"$/g, "");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await axios.get(`http://localhost:8000/v1/lps/${lpId}/comments`, {
    params: { cursor, order, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};

export const postComment = async ({
  lpId,
  content,
  token,
}: {
  lpId: string;
  content: string;
  token: string;
}) => {
  const res = await axios.post(
    `http://localhost:8000/v1/lps/${lpId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
