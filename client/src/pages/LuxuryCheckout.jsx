import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { FaLock } from 'react-icons/fa';
import '../styles/PremiumTheme.css';

const LuxuryCheckout = () => {
    const { cart } = useGlobal();
    const cartItems = Object.values(cart);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="checkout-container">
            {/* Left Side: Information */}
            <div className="checkout-left">
                <div className="checkout-header">
                    <h1>Private Client Information</h1>
                </div>

                <form className="checkout-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder=" " />
                    </div>

                    <div className="form-section-title">Shipping Address</div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" placeholder=" " />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" placeholder=" " />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" placeholder=" " />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" placeholder=" " />
                        </div>
                        <div className="form-group">
                            <label>Postal Code</label>
                            <input type="text" placeholder=" " />
                        </div>
                    </div>

                    <div className="form-section-title">Payment</div>
                    <div className="form-group">
                        <label>Card Number</label>
                        <input type="text" placeholder=" " />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Expiry</label>
                            <input type="text" placeholder="MM / YY" />
                        </div>
                        <div className="form-group">
                            <label>CVC</label>
                            <input type="text" placeholder=" " />
                        </div>
                    </div>

                    <div className="checkout-security">
                        <FaLock size={12} color="#666" />
                        <span>Encrypted Boutique Security</span>
                    </div>
                </form>
            </div>

            {/* Right Side: Order Summary */}
            <div className="checkout-right">
                <div className="summary-content">
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <img src={item.image} alt={item.name} className="summary-thumb" />
                                <div className="summary-details">
                                    <div className="summary-name">{item.name}</div>
                                    <div className="summary-price">${item.price.toLocaleString()}</div>
                                    <div className="summary-qty">Qty: {item.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-footer">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Complimentary</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>

                        <div className="delivery-note">
                            Complimentary white-glove delivery included.
                        </div>

                        <button className="checkout-complete-btn">
                            COMPLETE PURCHASE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LuxuryCheckout;
