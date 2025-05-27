import { useCartInfo } from '../hooks/useCartStore';

const PriceBox = () => {
    const { total, cartItems } = useCartInfo();

    if (cartItems.length === 0) 
        return null;
    
    return (
        <div className='p-12 flex flex-col items-center gap-4'>
            <div>총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;