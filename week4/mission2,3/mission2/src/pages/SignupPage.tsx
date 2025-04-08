import {z} from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const schema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
    .string()
    .min(8, { 
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
    })
    .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
    }),
    passwordCheck: z
    .string()
    .min(8, {
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
    })
    .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
    }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
})
.refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => { 
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>( {
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const onSubmit : SubmitHandler<FormFields> = async(data) => {
        const { passwordCheck, ...rest } = data;
        
        const response = await postSignup(rest);
        
        console.log(response);
    };

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
                    {...register("email")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"} 
                    placeholder={"이메일"}
                />
                {errors?.email && (
                    <div className="text-red-500 text-sm">{errors.email.message}</div>
                )}
                <input
                    {...register("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}                    
                    type={"password"} 
                    placeholder={"비밀번호"}
                />
                {errors?.password && (
                    <div className="text-red-500 text-sm">{errors.password.message}</div>
                )}
                <input
                    {...register("passwordCheck")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}                    
                    type={"passwordCheck"} 
                    placeholder={"비밀번호 확인"}
                />
                {errors?.passwordCheck && (
                    <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
                )}
                <input
                    {...register("name")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}                    
                    type={"password"} 
                    placeholder={"이름"}
                />
                {errors?.name && (
                    <div className="text-red-500 text-sm">{errors.name.message}</div>
                )}
                <button 
                    disabled={isSubmitting}
                    type='button' 
                    onClick={handleSubmit(onSubmit)} 
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default SignupPage;

function handleBackClick(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
}
