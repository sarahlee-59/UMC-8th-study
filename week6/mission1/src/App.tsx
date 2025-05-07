// App.tsx
import "./App.css";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import LpCreatePage from "./pages/LpCreatePage";
import LpEditPage from "./pages/LpEditPage";
import MyLpListPage from "./pages/MyLpListPage";
import CommentEditPage from "./pages/CommentEditPage";
import LikeListPage from "./pages/LikeListPage";
import UploadPage from "./pages/UploadPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { AuthProvider } from "./context/AuthContext";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage/>},
    ],
  },
];

// 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "my", element: <MyPage /> }, // 내 정보
      { path: "lps/create", element: <LpCreatePage /> }, // LP 생성
      { path: "lps/edit/:lpId", element: <LpEditPage /> }, // LP 수정
      { path: "lps/my", element: <MyLpListPage /> }, // 내가 생성한 LP 목록
      { path: "comments/edit/:commentId", element: <CommentEditPage /> }, // 댓글 수정
      { path: "likes/my", element: <LikeListPage /> }, // 내가 좋아요한 LP 목록
      { path: "uploads", element: <UploadPage /> }, // 이미지 업로드
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient : QueryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;