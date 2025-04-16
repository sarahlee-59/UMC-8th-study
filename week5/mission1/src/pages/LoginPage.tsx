import useForm from '../hooks/useForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSigninInformation, validateSignin } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { ResponseSigninDto } from '../types/auth';
import { postSignin } from '../apis/auth';
import { LOCAL_STORAGE_KEY } from '../constants/key';

const LoginPage = () => {
    const { accessToken, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () => {
        if (accessToken) {
            if (location.pathname === "/login") {
                navigate("/");
            }
        }
    }, [navigate, accessToken, location.pathname]);
    
    const handleBackClick = () => {
        navigate("/");
    };

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValues: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        });

        const handleSubmit = async () => {
            console.log(values);
            try {
                const response: ResponseSigninDto = await postSignin(values);
                login({ email: values.email, password: values.password });
                
                navigate("/my"); // 이동 추가
            } catch (error) {
                console.error("로그인 실패:", error);
                alert(error);
            }
        };

    // 오류가 하나라도 있거나, 입력값이 비어 있으면 버튼 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
        Object.values(values).some((value) => value === ""); // 입력값이 비어 있으면 true

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <button className="text-2xl" onClick={handleBackClick}>&lt;</button>
                    <h1 className="text-3xl font-medium text-center w-full">로그인</h1>
                </div>
                <br />
                <button className="w-full flex items-center justify-center border border-white py-2 rounded-md mb-4">
                <img src="google.png" alt="Google" className="w-5 h-5 mr-2" />구글 로그인</button>
                
                <div className="flex items-center w-full gap-2 my-2">
                    <hr className="flex-grow border-t border-white opacity-50" />
                    <span className="text-sm text-white">OR</span>
                    <hr className="flex-grow border-t border-white opacity-50" />
                </div>

                <input 
                    {...getInputProps("email")}
                    name="email"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"} 
                    placeholder={"이메일을 입력해주세요!"}
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}                    
                    type={"password"} 
                    placeholder={"비밀번호를 입력해주세요!"}
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button 
                    type='button' 
                    onClick={handleSubmit} 
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;