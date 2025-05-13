// hooks/mutations/useUpdateNickname.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/user";
import { ResponseMyInfoDto } from "../../types/auth";

interface UpdateMyInfoBody {
  name: string;
  bio?: string;
  avatar?: string;
}

export default function useUpdateNickname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInfo,
    onMutate: async (formData: UpdateMyInfoBody) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      const previousUser = queryClient.getQueryData<ResponseMyInfoDto>(["myInfo"]);

      queryClient.setQueryData<ResponseMyInfoDto>(["myInfo"], (old) => ({
        ...old!,
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
      }));

      return { previousUser };
    },
    onError: (_err, _formData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["myInfo"], context.previousUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
}
