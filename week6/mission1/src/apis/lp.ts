import { PaginationDto } from '../types/common.ts';
import { ResponseLpListDto } from '../types/lp.ts';
import { axiosInstance } from './axios';

export const getLpList = async (
    paginationDto: PaginationDto,
) : Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
};