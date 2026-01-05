import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/PremiumTheme.css';

const CartDrawer = () => {
    const navigate = useNavigate();
    const { isCartOpen, toggleCart, cart } = useGlobal();
    const cartItems = Object.values(cart);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (!isCartOpen) return null;

    return (
        <>
            <div className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => toggleCart(false)}></div>
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <span>YOUR BAG ({cartItems.length})</span>
                    <button className="cart-close" onClick={() => toggleCart(false)}>&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666', fontFamily: 'var(--font-sans)' }}>
                            Your bag is empty.
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-thumb" />
                                <div className="cart-details">
                                    <div className="cart-brand">AWIK SPECTRUM</div>
                                    <div className="cart-name">{item.name}</div>
                                    <div className="cart-price">${item.price.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Qty: {item.quantity}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-sans)' }}>
                        <span>SUBTOTAL</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <button
                        className="cart-checkout-btn"
                        onClick={() => {
                            toggleCart(false);
                            navigate('/checkout');
                        }}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
