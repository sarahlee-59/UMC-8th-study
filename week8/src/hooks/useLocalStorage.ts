export const useLocalStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            // JWT 토큰 등 문자열은 그대로, 객체는 JSON.stringify로 저장
            if (typeof value === "string") {
                window.localStorage.setItem(key, value);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getItem = (): string | null => {
        try {
            const item = window.localStorage.getItem(key);
            // undefined가 반환될 일은 없지만, 혹시라도 null로 변환
            return item ?? null;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };

    return { setItem, getItem, removeItem };
};
