import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { useGlobal } from '../context/GlobalContext';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../config';
import '../styles/PremiumTheme.css';

const formatINR = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', sub: 'Pay in cash at the time of white-glove delivery', enabled: true },
  { id: 'CARD', label: 'Card · Coming Soon', sub: 'Secure card payment is being introduced', enabled: false },
];

const LuxuryCheckout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useGlobal();
  const { user } = useContext(AuthContext);

  const cartItems = Object.values(cart);
  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0),
    [cartItems]
  );
  const shippingPrice = 0; // complimentary white-glove
  const taxPrice = Math.round(subtotal * 0.18); // 18% GST
  const totalPrice = subtotal + shippingPrice + taxPrice;

  // ---------- Form state ----------
  const splitName = (user?.name || '').split(' ');
  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.firstName || splitName[0] || '',
    lastName: user?.lastName || splitName.slice(1).join(' ') || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || '',
    paymentMethod: 'COD',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { orderId } on success

  // ---------- Guards ----------
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);



  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Lightweight validation
    const required = ['email', 'firstName', 'lastName', 'street', 'city', 'state', 'postalCode', 'country', 'phone'];
    for (const key of required) {
      if (!form[key]?.trim()) {
        setError(`Please complete the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    const payload = {
      orderItems: cartItems.map((item) => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
      shippingAddress: {
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.postalCode,
        country: form.country,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      itemsPrice: subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    try {
      setSubmitting(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_BASE}/api/orders`, payload, config);
      // Server clears the cart server-side; sync local state too
      await clearCart();
      setSuccess({ orderId: data?._id, total: totalPrice });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        'We could not complete your order. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Success view ----------
  if (success) {
    return (
      <motion.div
        className="checkout-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '80px 40px' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            border: '1px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37',
            marginBottom: 36,
          }}
        >
          <FaCheck size={28} />
        </motion.div>

        <h1
          style={{
            fontFamily: "'Libre Bodoni', 'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            letterSpacing: '0.08em',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: 16,
          }}
          data-testid="checkout-success-title"
        >
          Your order has been received.
        </h1>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#666', textAlign: 'center', maxWidth: 520, lineHeight: 1.8, letterSpacing: '0.04em', fontSize: '0.85rem', marginBottom: 12 }}>
          A private confirmation is being prepared. The maison will despatch your piece within three business days.
        </p>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', marginBottom: 8 }}>
          Reference
        </div>
        <div style={{ fontFamily: "'Libre Bodoni', serif", fontSize: '1rem', color: '#1a1a1a', marginBottom: 8 }} data-testid="checkout-success-orderid">
          {success.orderId ? `#${String(success.orderId).slice(-10).toUpperCase()}` : 'Pending'}
        </div>
        <div style={{ fontFamily: "'Libre Bodoni', serif", fontSize: '1.4rem', color: '#1a1a1a', marginBottom: 48 }}>
          {formatINR(success.total)}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/profile')}
            className="checkout-complete-btn"
            style={{ minWidth: 220, background: '#1a1a1a' }}
            data-testid="checkout-success-view-orders"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="checkout-complete-btn"
            style={{ minWidth: 220, background: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
            data-testid="checkout-success-continue"
          >
            Continue Browsing
          </button>
        </div>
      </motion.div>
    );
  }

  // ---------- Checkout view ----------
  return (
    <div className="checkout-container">
      {/* Left Side: Information */}
      <div className="checkout-left">
        <div className="checkout-header">
          <h1>Private Client Information</h1>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              autoComplete="email"
              data-testid="checkout-email"
              required
            />
          </div>

          <div className="form-section-title">Shipping Address</div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder=" "
                autoComplete="given-name"
                data-testid="checkout-firstName"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder=" "
                autoComplete="family-name"
                data-testid="checkout-lastName"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder=" "
              autoComplete="street-address"
              data-testid="checkout-street"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder=" "
                autoComplete="address-level2"
                data-testid="checkout-city"
                required
              />
            </div>
            <div className="form-group">
              <label>State / Province</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder=" "
                autoComplete="address-level1"
                data-testid="checkout-state"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder=" "
                autoComplete="postal-code"
                data-testid="checkout-postalCode"
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                data-testid="checkout-country"
                style={{
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  padding: '10px 0',
                  fontFamily: "'Libre Bodoni', serif",
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  background: 'transparent',
                  outline: 'none',
                }}
                required
              >
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder=" "
              autoComplete="tel"
              data-testid="checkout-phone"
              required
            />
          </div>

          <div className="form-section-title">Payment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = form.paymentMethod === pm.id;
              return (
                <label
                  key={pm.id}
                  htmlFor={`pm-${pm.id}`}
                  data-testid={`checkout-pm-${pm.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '18px 20px',
                    border: `1px solid ${isSelected ? '#1a1a1a' : '#e0e0e0'}`,
                    cursor: pm.enabled ? 'pointer' : 'not-allowed',
                    opacity: pm.enabled ? 1 : 0.45,
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <input
                    id={`pm-${pm.id}`}
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={isSelected}
                    onChange={handleChange}
                    disabled={!pm.enabled}
                    style={{ accentColor: '#1a1a1a' }}
                  />
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>
                      {pm.label}
                    </div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.72rem', color: '#888', marginTop: 4, letterSpacing: '0.02em' }}>
                      {pm.sub}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>



          <div className="checkout-security">
            <FaLock size={12} color="#666" />
            <span>Encrypted Boutique Security · GDPR Compliant</span>
          </div>
        </form>
      </div>

      {/* Right Side: Order Summary */}
      <div className="checkout-right">
        <div className="summary-content">
          <div className="summary-items">
            {cartItems.length === 0 ? (
              <div style={{ fontFamily: "'Libre Bodoni', serif", fontStyle: 'italic', color: '#888', textAlign: 'center', padding: '30px 0' }}>
                Your bag is empty.
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.image && <img src={item.image} alt={item.name} className="summary-thumb" />}
                  <div className="summary-details">
                    <div className="summary-name">{item.name}</div>
                    <div className="summary-price">{formatINR(item.price)}</div>
                    <div className="summary-qty">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="summary-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>{formatINR(taxPrice)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span data-testid="checkout-total">{formatINR(totalPrice)}</span>
            </div>

            <div className="delivery-note">
              Complimentary white-glove delivery included.
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    marginBottom: 20,
                    padding: '14px 18px',
                    border: '1px solid #b91c1c',
                    color: '#b91c1c',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.78rem',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  data-testid="checkout-error"
                >
                  <FaExclamationTriangle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="checkout-complete-btn"
              onClick={handleSubmit}
              disabled={submitting || cartItems.length === 0}
              style={{ opacity: submitting || cartItems.length === 0 ? 0.6 : 1, cursor: submitting || cartItems.length === 0 ? 'not-allowed' : 'pointer' }}
              data-testid="checkout-complete-btn"
            >
              {submitting ? 'PROCESSING…' : 'COMPLETE PURCHASE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryCheckout;
