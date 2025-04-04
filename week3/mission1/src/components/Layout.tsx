import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold text-[#dda5e3]">
            <NavLink to="/">MovieFlix</NavLink>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${isActive ? "bg-[#dda5e3] text-white" : "hover:bg-purple-100"}`
              }
            >
              홈
            </NavLink>

            <NavLink
              to="/movies/popular"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${isActive ? "bg-[#dda5e3] text-white" : "hover:bg-purple-100"}`
              }
            >
              인기 영화
            </NavLink>

            <NavLink
              to="/movies/upcoming"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${isActive ? "bg-[#dda5e3] text-white" : "hover:bg-purple-100"}`
              }
            >
              개봉 예정
            </NavLink>

            <NavLink
              to="/movies/top-rated"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${isActive ? "bg-[#dda5e3] text-white" : "hover:bg-purple-100"}`
              }
            >
              평점 높은
            </NavLink>

            <NavLink
              to="/movies/now_playing"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${isActive ? "bg-[#dda5e3] text-white" : "hover:bg-purple-100"}`
              }
            >
              상영 중
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content - Outlet for child routes */}
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}