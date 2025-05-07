import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lp } from "../types/lp";
import { Comment } from "../types/comment";
import CommentListSkeletonList from "../components/CommentCard/CommentListSkeletonList";
import CommentList from "../components/CommentCard/CommentList";

const fetchLpById = async (id: string): Promise<Lp> => {
	const response = await axios.get(`http://localhost:8000/v1/lps/${id}`);
	return response.data.data;
};

const LpDetailPage = () => {

    const navigate = useNavigate(); 
	const params = useParams();
	const id = params.id;

	const getLpDetail = () => {
		return fetchLpById(id!);
	};

	const {data: lp, isLoading, isError} = useQuery({
		queryKey: ["lpDetail", id],
		queryFn: getLpDetail,
		enabled: !!id,
	});

    const comments: Comment[] = [
        { id: 1, author: "User1", content: "곡이 너무 좋아요", createdAt: "2024-04-01T10:00:00" },
        { id: 2, author: "User2", content: "오늘부터 제 최애곡이에요!", createdAt: "2024-04-05T12:00:00" },
        { id: 3, author: "User3", content: "자꾸만 듣고 싶어지는 곡이에요", createdAt: "2024-04-10T08:00:00" },
    ];

	if (isError || !lp) {
		return <div className="text-red-500">Error Occurred</div>;
	}

	return (
		<div className="max-w-4xl text-white text-center mx-auto px-6 py-10 space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="cursor-pointer">돌아가기</button>
                <div className="flex gap-5">
                    <button>수정</button>
                    <button>삭제</button>
                    <button>♡</button>
                </div>
            </div>
            
			<img src={lp.thumbnail} alt={lp.title} className="w-64 h-64 object-cover mx-auto" />
			<h2 className="text-2xl font-bold">{lp.title}</h2>
			<p>{lp.content}</p>

            {isLoading ? (<CommentListSkeletonList count={3} />) : (<CommentList comments={comments}/>)}
		</div>
	);
};

export default LpDetailPage;