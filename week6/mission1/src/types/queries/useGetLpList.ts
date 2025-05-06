import { useQuery } from '@tanstack/react-query';
import { PaginationDto } from '../../types/common';
import { getLpList } from '../../apis/lp.ts';
import { QUERY_KEY } from '../../constants/key.ts';

function useGetLpList ({ cursor, search, order, limit }: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps],
        queryFn: () => 
            getLpList({ 
                cursor, 
                search, 
                order, 
                limit,
            }),
            // 데이터가 신선하다고 간주하는 시간
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 100 * 60 * 10, // 10 minutes
    });
}

export default useGetLpList;