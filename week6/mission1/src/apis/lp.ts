import axios from "axios";
import { PaginationDto } from "../types/common";
import { LpListResponse } from "../types/lp";

export const getLPList = async (params: PaginationDto): Promise<LpListResponse> => {
  const response = await axios.get("/v1/lps", { params });
  return response.data;
};
