import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate(); 
    const {logout} = useAuth(); 
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo(); 
            console.log(response);
            setData(response);
        };
        getData();
    }, []); 

    const handleLogout = async () => {
        await logout(); 
        navigate("/");
    };
    return (<div className="text-pink-500 text-xl flex flex-col items-center">
            <h1>{data?.data?.name}님 환영합니다.</h1>
            <h1>{data?.data?.email}</h1>
            <button onClick={handleLogout} className="rounded-xl bg-gray-700 p-3 mt-10 font-bold text-white cursor-pointer hover:scale-90">로그아웃</button>
        </div>);
}

export default MyPage; 