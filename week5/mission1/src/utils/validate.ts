export type UserSigninInformation = {
    email: string;
    password: string;
}

function validateUser(values: UserSigninInformation) {
    const errors = {
        email: "",
        password: "",
    };

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        values.email,
    )) {
        errors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 비밀번호 8자 20자 사이
    if (!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    return errors;
}

function validateSignin(values: UserSigninInformation) {
    return validateUser(values);
}

export { validateSignin };