import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage"; 

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이상이어야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
    nickname: z.string().min(1, { message: "닉네임을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const [step, setStep] = useState(1); 
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");

  const { setItem } = useLocalStorage("signupData");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    setItem(rest); 
    const response = await postSignup(rest);
    console.log(response);
  };

  const isNextButtonDisabled = !(passwordValue && passwordCheckValue && passwordValue === passwordCheckValue);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-[350px] flex flex-col gap-3">
        <div className="flex items-center justify-between mb-4">
          <button className="text-2xl" onClick={() => setStep(1)}>
            &lt;
          </button>
          <h1 className="text-3xl font-medium text-center flex-grow">회원가입</h1>
        </div>

        {step === 1 && (
          <>
            <button className="w-full flex items-center justify-center border border-white py-2 rounded-md">
              <img src="google.png" alt="Google" className="w-5 h-5 mr-2" />
              구글 로그인
            </button>

            <div className="flex items-center w-full gap-2 my-4">
              <hr className="flex-grow border-t border-white opacity-50" />
              <span className="text-sm text-white">OR</span>
              <hr className="flex-grow border-t border-white opacity-50" />
            </div>

            <input
              {...register("email")}
              className={`border w-full p-3 rounded-md bg-black text-white ${
                errors.email ? "border-red-500 bg-red-200 text-black" : "border-gray-300"
              }`}
              type="email"
              placeholder="이메일을 입력해주세요!"
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}

            <button
              type="button"
              disabled={!emailValue || !!errors.email}
              className={`w-full py-3 rounded-md mt-2 ${
                !emailValue || errors.email ? "bg-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
              }`}
              onClick={() => setStep(2)}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">{emailValue}</span>
            </div>

            <div className="relative">
              <input
                {...register("password")}
                className={`border w-full p-3 rounded-md bg-black text-white pr-10 ${
                  errors.password ? "border-red-500 bg-red-200 text-black" : "border-gray-300"
                }`}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

            <div className="relative">
              <input
                {...register("passwordCheck")}
                className={`border w-full p-3 rounded-md bg-black text-white pr-10 ${
                  errors.passwordCheck ? "border-red-500 bg-red-200 text-black" : "border-gray-300"
                }`}
                type={showPasswordCheck ? "text" : "password"}
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                onClick={() => setShowPasswordCheck((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswordCheck ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.passwordCheck && <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>}

            <input
              {...register("name")}
              className={`border w-full p-3 rounded-md bg-black text-white ${
                errors.name ? "border-red-500 bg-red-200 text-black" : "border-gray-300"
              }`}
              type="text"
              placeholder="이름"
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

            <button
              type="button"
              disabled={isNextButtonDisabled}
              className={`w-full py-3 rounded-md mt-2 ${
                isNextButtonDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
              onClick={() => setStep(3)}
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">프로필 이미지</span>
              </div>
            </div>

            <input
              {...register("nickname")}
              className={`border w-full p-3 rounded-md bg-black text-white ${
                errors.nickname ? "border-red-500 bg-red-200 text-black" : "border-gray-300"
              }`}
              type="text"
              placeholder="닉네임"
            />
            {errors.nickname && <div className="text-red-500 text-sm">{errors.nickname.message}</div>}

            <button
              disabled={isSubmitting}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-pink-500 text-white py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300 mt-2"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
