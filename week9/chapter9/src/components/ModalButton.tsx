import { useModalStore } from '../hooks/useModalStore';

const ModalButton = () => {
  const openModal = useModalStore((state) => state.openModal);
  return (
    <button
      onClick={openModal}
      className="border px-4 py-2 rounded hover:bg-gray-100"
    >
      전체 삭제
    </button>
  );
};

export default ModalButton;
