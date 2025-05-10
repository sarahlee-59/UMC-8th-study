import axios from "axios";
import { PaginationDto } from "../types/common";
import { LpListResponse } from "../types/lp";

export const getLPList = async (params: PaginationDto): Promise<LpListResponse> => {
  const response = await axios.get("/v1/lps", { params });
  return response.data;
};

export const postLp = async (lpData: {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
}) => {
  const res = await axios.post("http://localhost:8000/v1/lps", {
    ...lpData,
    published: true,
  });
  return res.data;
};
