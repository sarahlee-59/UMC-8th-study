import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { postSignin } from "../apis/auth";
import useAuth from "../context/AuthContext";

const LoginPage = () => {
  const {
    setAccessToken,
    setRefreshToken,
    setUser,
    accessToken,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const mutation = useMutation({
    mutationFn: postSignin,
    onSuccess: (res) => {
      const { accessToken, refreshToken, id, name } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser({ id, name, email: values.email });

      alert("로그인 성공");
      navigate("/my");
    },
    onError: (err) => {
      console.error("로그인 실패", err);
      alert("로그인 실패");
    },
  });

  const handleSubmit = () => {
    mutation.mutate(values); // values = { email, password }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 ">
      <div className="flex flex-col gap-3">
        <div className="flex items-center ">
          <button
            className="text-white text-2xl cursor-pointer mr-25"
            onClick={() => navigate(-1)}
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-white ">로그인</h1>
        </div>
        <input
          {...getInputProps("email")}
          type="email"
          placeholder="이메일을 입력해주세요"
          className={`border w-[300px] p-[10px] rounded-sm text-white placeholder-gray-200 focus:outline-pink-500 focus:outline-2 ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-gray-200"
          }`}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className={`border w-[300px] p-[10px] rounded-sm text-white placeholder-gray-200 focus:outline-pink-500 focus:outline-2 ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-gray-200"
          }`}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled || mutation.isPending}
          className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-bold hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-gray-700"
        >
          {mutation.isPending ? "로그인 중..." : "로그인"}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-bold hover:bg-pink-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <img className="h-5 pr-3" src="/google.png" />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
