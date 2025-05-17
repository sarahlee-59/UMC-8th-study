import axios from "axios";

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

export const postComment = async ({
  lpId,
  content,
  token,
}: {
  lpId: string;
  content: string;
  token: string;
}) => {
  const response = await axios.post(
    `http://localhost:8000/v1/lps/${lpId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};