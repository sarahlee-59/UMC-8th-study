import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Lp } from "../types/lp";
import CommentListSkeletonList from "../components/CommentCard/CommentListSkeletonList";
import CommentCard from "../components/CommentCard/CommentList";
import useGetInfiniteCommentsByLpId from "../hooks/queries/useGetInfiniteCommentsByLpId";
import CommentInput from "../components/CommentCard/CommentInput";
import { useAuth } from "../context/AuthContext";
import { Heart, Pencil, Trash2, ImagePlus } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

const apiUrl = import.meta.env.VITE_SERVER_API_URL;

const fetchLpById = async (id: number): Promise<Lp> => {
  const response = await axios.get(`${apiUrl}/v1/lps/${id}`);
  return response.data.data;
};

const LpDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id!;
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { ref, inView } = useInView();

  // LP 상세 조회
  const {
    data: lp,
    isLoading: lpLoading,
    isError,
  } = useQuery({
    queryKey: ["lpDetail", id],
    queryFn: () => fetchLpById(Number(id)),
    enabled: !!id,
  });

  // 댓글 무한스크롤
  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading: commentLoading,
    refetch,
  } = useGetInfiniteCommentsByLpId(id, order);

  useEffect(() => {
    refetch();
  }, [order, refetch]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // LP 삭제
 const deleteCommentMutation = useMutation({
  mutationFn: ({ lpId, commentId }: { lpId: number; commentId: number }) =>
    axios.delete(`${apiUrl}/v1/lps/${lpId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    onSuccess: () => {
      alert("삭제 완료");
      navigate("/");
    },
    onError: () => {
      alert("삭제 실패");
    },
  });


  const deleteMutation = useMutation({
  mutationFn: async () => {
    await axios.delete(`${apiUrl}/v1/lps/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  onSuccess: () => {
    alert("LP가 삭제되었습니다.");
    navigate("/"); // 홈으로 이동
  },
  onError: (error) => {
    console.error("LP 삭제 실패", error);
    alert("LP 삭제 중 오류가 발생했습니다.");
  },
});


  const handleDelete = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) deleteMutation.mutate();
  };

  const handleEdit = () => {
    navigate(`/lp/${id}/edit`);
  };

  // 좋아요 상태 관리
  const [liked, setLiked] = useState(false);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  useEffect(() => {
    if (lp && user) {
      const hasLiked = lp.likes?.some((like) => like.userId === user.id);
      setLiked(hasLiked);
    }
  }, [lp, user]);

  const handleLikeToggle = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (liked) {
      disLikeMutate(Number(id), {
        onSuccess: () => {
          setLiked(false);
          queryClient.invalidateQueries({ queryKey: ["lpDetail", id] });
        },
      });
    } else {
      likeMutate(Number(id), {
        onSuccess: () => {
          setLiked(true);
          queryClient.invalidateQueries({ queryKey: ["lpDetail", id] });
        },
        onError: (err: any) => {
          if (err.response?.status === 409) {
            alert("이미 좋아요를 누른 게시글입니다.");
            setLiked(true); // ✅ 실제 좋아요 상태도 반영해줘야 함
          } else {
            alert("좋아요 실패");
          }
        },
      });
    }
  };

  // state로 editMode 선언
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editMode, setEditMode] = useState(false); // ✅ 이 선언이 있어야 함

  const handleImageButton = () => {
    fileInputRef.current?.click(); // ✅ 아이콘 클릭 시 input 열기
  };

  const editMutation = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `http://localhost:8000/v1/lps/${id}`,
        {
          title: editedTitle,
          content: editedContent,
          thumbnail: newImageUrl, // ✅ 이미지 URL을 전송
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      alert("수정 완료");
      queryClient.invalidateQueries({ queryKey: ["lpDetail", id] });
      setEditMode(false);
    },
    onError: () => {
      alert("수정 실패");
    },
  });

  // 수정모드 진입 시 기존 값 반영
  const startEditMode = () => {
    if (!lp) return;
    setEditedTitle(lp.title);
    setEditedContent(lp.content);
    setEditMode(true);
  };

  // 수정 완료 버튼 클릭 시
  const handleEditSubmit = () => {
    editMutation.mutate();
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${apiUrl}/v1/uploads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // useAuth()로부터 가져온 토큰
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = res.data.data.imageUrl;
      setNewImageUrl(imageUrl); // 또는 setThumbnail(imageUrl)
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const editCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      axios.patch(
        `/v1/comments/${id}`,
        { content },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  useEffect(() => {
  if (lp) {
    console.log("lp.thumbnail:", lp.thumbnail);
  }
}, [lp]);


  return (
    <div className="max-w-4xl text-white mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          돌아가기
        </button>
        <div className="flex gap-5">
          {lp?.authorId === user?.id && (
            <>
              <button onClick={startEditMode}>
                <Pencil />
              </button>
              <button onClick={handleImageButton}>
                <ImagePlus size={24} className="text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // 업로드 처리 함수 호출
                    handleImageUpload(file);
                  }
                }}
              />
              <button onClick={handleDelete}>
                <Trash2 />
              </button>
            </>
          )}
          <button onClick={handleLikeToggle}>
            <Heart
              color={liked ? "red" : "black"}
              fill={liked ? "red" : "transparent"}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      {lp?.thumbnail && (
        <img
          src={lp.thumbnail} // ✅ 서버에서 내려준 절대 URL이어야 함
          alt={lp.title}
          className="w-64 h-64 object-cover mx-auto"
        />
      )}

      <h2 className="text-2xl font-bold text-center">{lp?.title}</h2>
      <p className="text-center">{lp?.content}</p>

      {/* 댓글 정렬 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder("asc")}
          className={`px-3 py-1 border rounded ${
            order === "asc" ? "bg-white text-black" : "bg-zinc-700 text-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`px-3 py-1 border rounded ${
            order === "desc" ? "bg-white text-black" : "bg-zinc-700 text-white"
          }`}
        >
          최신순
        </button>
      </div>

      <div className="space-y-4 mt-10 text-white">
        <div className="font-bold text-2xl">댓글</div>
        <CommentInput lpId={id} />
        {commentLoading ? (
          <CommentListSkeletonList count={5} />
        ) : (
          commentPages?.pages
            .flatMap((page) => page.data)
            .map((comment) => (
              <CommentCard
                key={comment.id}
                commentId={comment.id}
                author={comment.author?.name}
                content={comment.content}
                createdAt={comment.createdAt}
                isMine={comment.author?.id === user?.id} // ✅ 본인 여부 판단
                onEdit={(id, newContent) =>
                  editCommentMutation.mutate({ id, content: newContent })
                } // ✅ 수정 함수
                onDelete={(commentId) =>
                  deleteCommentMutation.mutate({ lpId: Number(id), commentId })
                }
              />
            ))
        )}
        {isFetching && <CommentListSkeletonList count={3} />}
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
};

export default LpDetailPage;
