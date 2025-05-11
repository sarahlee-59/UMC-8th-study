import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
        onSuccess: ({lpId}) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpDetail, lpId],
                exact: true,
            });
        }
    });
}

export default usePostLike;