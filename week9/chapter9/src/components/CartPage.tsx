import { useAppSelector } from '../hooks/useCustomRedux';
import Modal from '../components/Modal';
import ModalButton from '../components/ModalButton';

const CartPage = () => {
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">장바구니</h1>
      <ModalButton />
      {isOpen && <Modal />} {}
    </div>
  );
};

export default CartPage;
