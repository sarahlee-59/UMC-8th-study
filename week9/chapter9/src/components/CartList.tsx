import cartItems from "../constants/cartItems";

const CartList = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            {cartItems}
        </div>
    );
};

export default CartList;