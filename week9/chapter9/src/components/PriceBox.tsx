import { useAppDispatch, useAppSelector } from '../hooks/useCustomRedux';
import { openModal } from '../slices/modalSlice';

const PriceBox = () => {
    const { total } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    const handleInitializeCart = () => {
        dispatch(openModal());
    };

    return (
        <div className='p-12 flex flex-col items-center gap-4'>
            <button
                onClick={handleInitializeCart}
                className='border p-4 rounded-md cursor-pointer'
                >
                    전체 삭제
            </button>
            <div>총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;