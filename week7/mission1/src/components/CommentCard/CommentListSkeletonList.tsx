// components/CommentCard/CommentListSkeletonList.tsx
import CommentListSkeleton from "./CommentListSkeleton";

interface Props {
  count: number;
}

const CommentListSkeletonList = ({ count }: Props) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <CommentListSkeleton key={idx} />
      ))}
    </div>
  );
};

export default CommentListSkeletonList;
