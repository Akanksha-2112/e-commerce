import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import '../../styles/PremiumTheme.css';

const formatINR = (price) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price ?? 0);

const CartDrawer = () => {
    const navigate = useNavigate();
    const { isCartOpen, toggleCart, cart, removeFromCart } = useGlobal();
    const cartItems = Object.values(cart);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

    if (!isCartOpen) return null;

    return (
        <>
            <div className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => toggleCart(false)}></div>
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <span>YOUR BAG ({cartItems.length})</span>
                    <button className="cart-close" onClick={() => toggleCart(false)} data-testid="cart-close">&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666', fontFamily: 'var(--font-sans)' }}>
                            Your bag is empty.
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                                {item.image && <img src={item.image} alt={item.name} className="cart-thumb" />}
                                <div className="cart-details">
                                    <div className="cart-brand">AWIK SPECTRUM</div>
                                    <div className="cart-name">{item.name}</div>
                                    <div className="cart-price">{formatINR(item.price)}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>Qty: {item.quantity}</div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Remove from bag"
                                    data-testid={`cart-remove-${item.id}`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#888',
                                        cursor: 'pointer',
                                        alignSelf: 'flex-start',
                                        padding: 8,
                                    }}
                                >
                                    <FaTrashAlt size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-sans)' }}>
                        <span>SUBTOTAL</span>
                        <span data-testid="cart-subtotal">{formatINR(subtotal)}</span>
                    </div>
                    <button
                        className="cart-checkout-btn"
                        disabled={cartItems.length === 0}
                        onClick={() => {
                            toggleCart(false);
                            navigate('/checkout');
                        }}
                        data-testid="cart-checkout-btn"
                        style={{
                            opacity: cartItems.length === 0 ? 0.5 : 1,
                            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
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
