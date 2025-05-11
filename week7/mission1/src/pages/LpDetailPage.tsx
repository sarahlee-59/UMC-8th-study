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
  const lpid = Number(id);
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { ref, inView } = useInView();

  const { data: lp, isLoading: lpLoading } = useQuery({
    queryKey: ["lpDetail", lpid],
    queryFn: () => fetchLpById(lpid),
    enabled: !!id,
  });

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

  const deleteCommentMutation = useMutation({
    mutationFn: ({ lpId, commentId }: { lpId: number; commentId: number }) =>
      axios.delete(`${apiUrl}/v1/lps/${lpId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    onSuccess: () => refetch(),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${apiUrl}/v1/lps/${lpid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      navigate("/");
    },
  });

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  const [liked, setLiked] = useState(false);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  useEffect(() => {
    if (lp && user) {
      setLiked(lp.likes?.some((like) => like.userId === user.id) || false);
    }
  }, [lp, user]);

  const handleLikeToggle = () => {
    if (!accessToken) return alert("로그인이 필요합니다.");

    const action = liked ? disLikeMutate : likeMutate;
    action(lpid, {
      onSuccess: () => {
        setLiked(!liked);
        queryClient.invalidateQueries({ queryKey: ["lpDetail", id] });
      },
    });
  };

  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  const startEditMode = () => {
    if (!lp) return;
    setEditedTitle(lp.title);
    setEditedContent(lp.content);
    setEditedTags(lp.tags?.map((tag) => tag.name) || []);
    setEditMode(true);
  };

  const handleImageButton = () => fileInputRef.current?.click();
  const handleAddTag = () => {
    if (newTag && !editedTags.includes(newTag)) {
      setEditedTags([...editedTags, newTag]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter((t) => t !== tag));
  };

  const editMutation = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${apiUrl}/v1/lps/${lpid}`,
        {
          title: editedTitle,
          content: editedContent,
          thumbnail: newImageUrl,
          tags: editedTags,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    },
    onSuccess: () => {
      alert("수정 완료");
      queryClient.invalidateQueries({ queryKey: ["lpDetail", id] });
      setEditMode(false);
    },
  });

  const handleEditSubmit = () => editMutation.mutate();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${apiUrl}/v1/uploads`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewImageUrl(res.data.data.imageUrl);
    } catch (error) {
      alert("이미지 업로드 실패");
    }
  };

  const editCommentMutation = useMutation({
    mutationFn: ({
      lpId,
      commentId,
      content,
    }: {
      lpId: number;
      commentId: number;
      content: string;
    }) =>
      axios.patch(
        `${apiUrl}/v1/lps/${lpId}/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      ),
    onSuccess: () => refetch(),
  });

  return (
    <div className="max-w-4xl text-white mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)}>돌아가기</button>
        <div className="flex gap-5">
          {lp?.authorId === user?.id && (
            <>
              <button onClick={startEditMode}>
                <Pencil />
              </button>
              {editMode && (
                <>
                  <button onClick={handleImageButton}>
                    <ImagePlus size={24} className="text-white" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0])
                    }
                  />
                </>
              )}
              <button onClick={handleDelete}>
                <Trash2 />
              </button>
            </>
          )}
          <button onClick={handleLikeToggle}>
            <Heart
              color={liked ? "red" : "black"}
              fill={liked ? "red" : "transparent"}
            />
          </button>
        </div>
      </div>

      {lp?.thumbnail && (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-64 h-64 object-cover mx-auto"
        />
      )}

      <div className="flex justify-end gap-2 mt-8">
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

      {editMode ? (
        <div className="space-y-4">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-white rounded"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-white rounded h-32"
          />

          <div className="flex flex-wrap gap-2">
            {editedTags.map((tag) => (
              <div
                key={tag}
                className="bg-zinc-800 border border-white px-3 py-1 rounded-full text-white flex items-center"
              >
                #{tag}{" "}
                <button
                  className="ml-2 text-xs"
                  onClick={() => handleRemoveTag(tag)}
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="p-2 bg-zinc-700 border border-white rounded w-full sm:w-3/4"
              placeholder="새 태그 입력"
            />
            <button
              onClick={handleAddTag}
              className="border border-white text-white px-6 py-2 rounded w-full sm:w-auto"
            >
              + 추가
            </button>
          </div>

          <button
            onClick={handleEditSubmit}
            className="border border-white text-white px-4 py-2 rounded"
          >
            저장
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center">{lp?.title}</h2>
          <p className="text-center">{lp?.content}</p>
          {lp?.tags && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="space-y-4 mt-6">
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
                isMine={comment.author?.id === user?.id}
                onEdit={(commentId, newContent) =>
                  editCommentMutation.mutate({
                    lpId: lpid,
                    commentId,
                    content: newContent,
                  })
                }
                onDelete={(commentId) =>
                  deleteCommentMutation.mutate({ lpId: lpid, commentId })
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
