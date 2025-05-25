import { Lp } from '../types/cart';

interface CartItemProps {
    lp: Lp;
}

const CartItem = ({lp} : CartItemProps) : Element => {
    return (
        <div className='flex'>
            <img
            src={lp.img}
            alt={`${lp.title}의 LP 이미지`}
            className='w-20 h-20 object-cover rounded mr-4'
            />
            <div>
                <h3 className='text-xl'>{lp.title}</h3>
            </div>
        </div>
    );
};

export default CartItem;