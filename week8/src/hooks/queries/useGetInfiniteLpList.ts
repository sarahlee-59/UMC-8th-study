import axios from "axios";
import { CursorBasedResponse } from "../../types/common";
import { Lp } from "../../types/lp";

export const useGetInfiniteLpList = async (
  cursor: number,
  order: "latest" | "oldest",
  limit = 8
): Promise<CursorBasedResponse<Lp[]>> => {
  const res = await axios.get("http://localhost:8000/v1/lps", {
    params: { 
      cursor, 
      order, 
      limit },
  });
  return res.data;
};

export default useGetInfiniteLpList;