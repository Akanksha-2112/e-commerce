import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import '../../styles/PremiumTheme.css';

const formatINR = (price) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price ?? 0);

const CartDrawer = () => {
    const navigate = useNavigate();
    const { isCartOpen, toggleCart, cart, removeFromCart, addToCart } = useGlobal();
    const cartItems = Object.values(cart);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

    if (!isCartOpen) return null;

    const handleQtyChange = (item, delta) => {
        const newQty = (item.quantity || 1) + delta;
        if (newQty <= 0) {
            removeFromCart(item.id);
        } else {
            addToCart({ ...item }, delta);
        }
    };

    return (
        <>
            <div className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => toggleCart(false)}></div>
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <span>YOUR BAG ({totalItems})</span>
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
                                    <div className="cart-brand">AWIK MAISON</div>
                                    <div className="cart-name">{item.name}</div>
                                    {(item.size || item.color) && (
                                        <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '3px', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>
                                            {[item.size, item.color].filter(Boolean).join(' · ')}
                                        </div>
                                    )}
                                    <div className="cart-price" style={{ marginTop: 6 }}>{formatINR(item.price * item.quantity)}</div>

                                    {/* Quantity Controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                                        <button
                                            onClick={() => handleQtyChange(item, -1)}
                                            aria-label="Decrease quantity"
                                            style={{ background: 'none', border: '1px solid #e0e0e0', width: 26, height: 26, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', flexShrink: 0 }}
                                        >
                                            <FaMinus size={9} />
                                        </button>
                                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', minWidth: 18, textAlign: 'center', color: '#1a1a1a' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQtyChange(item, 1)}
                                            aria-label="Increase quantity"
                                            style={{ background: 'none', border: '1px solid #e0e0e0', width: 26, height: 26, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', flexShrink: 0 }}
                                        >
                                            <FaPlus size={9} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Remove from bag"
                                    data-testid={`cart-remove-${item.id}`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#bbb',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#999' }}>
                        <span>Shipping</span>
                        <span style={{ color: '#4caf50' }}>Complimentary</span>
                    </div>
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
