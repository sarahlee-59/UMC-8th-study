import { ChangeEvent, useEffect, useState } from 'react';

interface useFormProps<T> {
    initialValues: T; // { email: '', password: '' }
    // 값이 올바른지 검증하는 함수.
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: useFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues); 
    const [touched, setTouched] = useState<Record<string, boolean>>();
    const [errors, setErrors] = useState<Record<string, string>>();

    // 사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues ( {
            ...values, // 불변성 유지(기존 값 유지)
            [name]: text,
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true, // 사용자가 해당 인풋을 터치했는지 여부
        });
    }

    // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps = (name: keyof T) => {
        const value = values[name]; 

        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
            handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name); 

        return {value, onChange, onBlur};
    };

    // values가 변경될 때마다 에러 검증 로직이 실행됨.
    // { email: ""}
    useEffect(() => {
        const errors = validate(values); // { email: "", password: ""}
        setErrors(errors); // 오류 메시지 업뎃
    }, [validate, values]); // values가 변경될 때마다 에러 검증 로직이 실행됨.

    return { values, errors, touched, getInputProps };
}

export default useForm;