import cartItems from '../constants/cartItems';
import CartItem from './CartItem';

const CartList = () : Element=> {
    return (
        <div className='flex flex-col items-center justify-center'>
            <ul>
                {cartItems.map((item) : Element => (
                    <CartItem key={item.id} lp={item}/>
                ))}
            </ul>
        </div>
    );
};
export default CartList;