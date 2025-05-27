import { useModalStore } from '../hooks/useModalStore';
import { useCartActions } from '../hooks/useCartStore';

const Modal = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const { clearCart } = useCartActions();

  const handleCancel = () => {
    (closeModal());
  };

  const handleConfirm = () => {
    (clearCart());
    (closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center">
        <p className="mb-4 text-lg">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
