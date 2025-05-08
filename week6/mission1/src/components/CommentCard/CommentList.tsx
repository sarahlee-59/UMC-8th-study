// components/CommentCard/CommentList.tsx

export interface CommentCardProps {
    author: string;
    content: string;
    createdAt: string;
  }
  
  const CommentCard = ({ author, content, createdAt }: CommentCardProps) => {
    return (
      <div>
        <div className="font-bold">{author}</div>
        <div>{content}</div>
        <div className="text-sm text-gray-400">{new Date(createdAt).toLocaleString()}</div>
      </div>
    );
  };
  
  export default CommentCard;
  