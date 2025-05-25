import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import modalReducer from '../slices/modalSlice';

// 1. 저장소 생성
function createStore() {
    const store = configureStore({
        // 2. 리듀서 설정
        reducer: {
            cart: cartReducer,
        },
    });

    return store;
}

// store를 활용할 수 있도록 내보내야 함.
// 여기서 실행해서 스토어를 빼준다.
// 싱글톤 패턴
const store = configureStore({
    reducer: {
        cart: cartReducer,
        modal: modalReducer,
    },
});

export default store;

// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsStae, comments: CommentsState, users: UserState}
export type AppDispatch = typeof store.dispatch;