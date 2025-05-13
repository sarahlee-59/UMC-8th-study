import { useState } from "react";
import { Lp } from "../../types/lp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const cardClick = () => {
    if (!accessToken) {
      const confirmed = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인 하시겠습니까?"
      );
      if (confirmed) {
        navigate("/login");
      }
    } else {
      navigate(`/lp/${lp.id}`);
    }
  };

  return (
    <div
      onClick={cardClick}
      className="relative aspect-square overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="object-cover w-full h-full transition duration-300 hover:brightness-50"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
          No Image
        </div>
      )}

      {/* Hover 시 오버레이 정보 */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-4 text-center transition-opacity duration-300">
          <h2 className="text-md font-bold leading-snug">{lp.title}</h2>
          <p className="text-sm text-gray-300 mt-2">
            {new Date(lp.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300 mt-1">{lp.likes.length} 좋아요</p>
        </div>
      )}

      {/* 항상 보이는 하단 제목 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <h3 className="text-white text-sm font-semibold truncate">
          {lp.title}
        </h3>
      </div>
    </div>
  );
};

export default LpCard;
