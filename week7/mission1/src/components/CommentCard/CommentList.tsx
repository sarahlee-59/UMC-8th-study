import { useState } from "react";
import { MoreVertical } from "lucide-react";

export interface CommentCardProps {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  isMine: boolean;
  onEdit: (id: number, newContent: string) => void;
  onDelete: (id: number) => void;
}

const CommentCard = ({
  commentId,
  author,
  content,
  createdAt,
  isMine,
  onEdit,
  onDelete,
}: CommentCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleUpdate = () => {
    onEdit(commentId, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="relative bg-[#1f1f1f] p-3 rounded border border-gray-600 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-pink-400">{author}</div>
          {isEditing ? (
            <input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded bg-gray-800 text-white border border-gray-500"
            />
          ) : (
            <div className="mt-1">{content}</div>
          )}
        </div>

        {isMine && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white text-black rounded shadow text-sm z-10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="block px-3 py-1 hover:bg-gray-200"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(commentId)}
                  className="block px-3 py-1 hover:bg-gray-200"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-400 mt-2">
        {new Date(createdAt).toLocaleString()}
      </div>

      {isEditing && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleUpdate}
            className="px-2 py-1 text-sm bg-pink-500 text-white rounded"
          >
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 text-sm text-gray-400"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
