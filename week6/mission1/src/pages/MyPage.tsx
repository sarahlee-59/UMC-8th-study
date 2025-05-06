import { useEffect, useState } from 'react';
import { getMyInfo } from '../apis/auth';
import { ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const { logout, accessToken } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
            return;
        }

        const getData = async () => {
            const response = await getMyInfo();
            console.log("응답 결과", response);
            console.log("Avatar URL:", response.data?.avatar);
            setData(response);
        }
        getData();
    }, [accessToken, navigate]);

    const handleLogout = async() => {
        await logout();
        navigate("/");
    }

    return (
        <div>
            {data && (
                <>
                    <h1>{data.data?.name}님 환영합니다.</h1>
                    <img src={data.data?.avatar ? data.data.avatar : "google.png"} alt="구글 로고"/>                   <h1>{data.data?.email}</h1>
                </>
            )}

            <button className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90" 
            onClick={handleLogout}
            >
                로그아웃
            </button>
        </div>
    )
};

export default MyPage;