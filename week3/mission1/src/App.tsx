import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import MovieDetailPage from "./pages/MovieDetailPage";
import { Navbar } from "./components/Navbar";
import MoviePage from "./pages/MoviePage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/movies/popular" />} />
        <Route path="/movies/:category" element={<MoviePage />} />
        <Route path="movie/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}