import { useAppDispatch } from '../hooks/useCustomRedux';
import { openModal } from '../slices/modalSlice';

const ModalButton = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(openModal())}
      className="border px-4 py-2 rounded hover:bg-gray-100"
    >
      전체 삭제
    </button>
  );
};

export default ModalButton;
