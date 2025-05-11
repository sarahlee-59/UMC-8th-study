import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";

function useDeleteLike() {
    return useMutation({
        mutationFn: deleteLike,
        onSuccess:({lpId}) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpDetail, lpId],
                exact: true,
            })
        }
    });
}

export default useDeleteLike;