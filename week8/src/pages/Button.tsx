import { useState } from "react";
import LpModal from "../components/LpModal";

const FloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && <LpModal onClose={() => setIsModalOpen(false)} />}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-pink-500 text-white text-3xl shadow-lg"
      >
        +
      </button>
    </>
  );
};

export default FloatingButton;
