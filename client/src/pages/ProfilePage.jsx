import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useGlobal } from '../context/GlobalContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../components/common/ImageUpload';
import { API_BASE } from '../config';

import '../styles/ProfilePage.css'; // Import the new Premium CSS
import {
    FaBoxOpen,
    FaSignOutAlt,
    FaHeart,
    FaCog,
    FaTrash,
    FaCheckCircle,
    FaExclamationTriangle,
    FaChartLine,
    FaHistory,
    FaShieldAlt,
    FaLock,
    FaStore
} from 'react-icons/fa';

const ProfilePage = () => {
    const {
        user,
        logout,
        loading,
        uploadProfilePicture,
        getUserStats,
        changePassword,
        deleteAccount,
        sendVerificationEmail,
        getWishlist,
        getRecentlyViewed,
        removeFromWishlist
    } = useContext(AuthContext);

    const navigate = useNavigate();

    const { addToCart, toggleCart } = useGlobal();

    const handleReorder = async (orderItems) => {
        if (!orderItems || orderItems.length === 0) return;
        for (const item of orderItems) {
            await addToCart({
                id: item.product,
                name: item.name,
                price: item.price,
                image: item.image,
                size: item.size || 'M',
                color: item.color || 'Black'
            }, item.qty || item.quantity || 1);
        }
        toggleCart(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [stats, setStats] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [loadingStats, setLoadingStats] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState({
        street: '', city: '', state: '', zipCode: '', country: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    // Settings State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);

    // UI State
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            // Sanitize name if it contains "undefined"
            let safeName = user.name;
            if (safeName && safeName.includes('undefined')) {
                const safeFirst = (user.firstName && user.firstName !== 'undefined') ? user.firstName : '';
                const safeLast = (user.lastName && user.lastName !== 'undefined') ? user.lastName : '';
                safeName = `${safeFirst} ${safeLast}`.trim();
            }
            if (!safeName) safeName = "Member";

            setName(safeName);
            setEmail(user.email);
            setPhone((user.phone && user.phone !== 'undefined') ? user.phone : '');
            setAddress(user.address || { street: '', city: '', state: '', zipCode: '', country: '' });
            setTwoFactorEnabled(user.twoFactorEnabled || false);

            fetchOrders();
            fetchStats();
            fetchWishlistData();
            fetchRecentlyViewedData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, navigate]);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE}/api/orders`, config);
            setOrders(Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []));
            setLoadingOrders(false);
        } catch (err) {
            console.error(err);
            setLoadingOrders(false);
        }
    };

    const fetchStats = async () => {
        setLoadingStats(true);
        const result = await getUserStats();
        if (result.success) {
            setStats(result.data);
        }
        setLoadingStats(false);
    };

    const fetchWishlistData = async () => {
        const result = await getWishlist();
        if (result.success) {
            setWishlist(Array.isArray(result.data) ? result.data : []);
        }
    };

    const fetchRecentlyViewedData = async () => {
        const result = await getRecentlyViewed();
        if (result.success) {
            setRecentlyViewed(Array.isArray(result.data) ? result.data : []);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(
                `${API_BASE}/api/auth/profile`,
                { name, email, phone, address },
                config
            );

            setMessage('Profile Updated Successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleToggle2FA = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const newValue = !twoFactorEnabled;
            // Optimistic update
            setTwoFactorEnabled(newValue);

            await axios.put(
                `${API_BASE}/api/auth/profile`,
                { twoFactorEnabled: newValue },
                config
            );

            setMessage(`Two-Factor Authentication ${newValue ? 'Enabled' : 'Disabled'}`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setTwoFactorEnabled(!twoFactorEnabled); // Revert
            setError('Failed to update 2FA settings');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleImageUpload = async (formData) => {
        setUploadingImage(true);
        const result = await uploadProfilePicture(formData);
        setUploadingImage(false);
        if (result.success) {
            setMessage('Profile picture updated!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }
        const result = await changePassword(currentPassword, newPassword);
        if (result.success) {
            setMessage('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteAccount = async () => {
        const result = await deleteAccount(deleteConfirmPassword);
        if (!result.success) {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleVerifyEmail = async () => {
        const result = await sendVerificationEmail();
        if (result.success) {
            setMessage('Verification email sent! Check your inbox.');
            setTimeout(() => setMessage(''), 5000);
        } else {
            setError(result.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        const result = await removeFromWishlist(productId);
        if (result.success) {
            setWishlist((currentWishlist) => (Array.isArray(currentWishlist) ? currentWishlist : []).filter(item => item._id !== productId));
            setMessage('Removed from wishlist');
            setTimeout(() => setMessage(''), 2000);
        } else {
            setError(result.message);
        }
    };

    // Animation Variants
    
    
    
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const safeRecentlyViewed = Array.isArray(recentlyViewed) ? recentlyViewed : [];

return (
        <>
            {showDeleteModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="axm-glass-panel" style={{ width: '90%', maxWidth: '450px' }}>
                        <h3 style={{ color: '#EF4444', fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--heading)' }}>
                            <FaExclamationTriangle /> Delete Account?
                        </h3>
                        <p style={{ color: 'var(--muted)', marginBottom: '30px', lineHeight: '1.6', fontFamily: 'var(--sans)' }}>
                            This action is permanent and cannot be undone. All your data will be erased from our exclusive records.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter password to confirm"
                            value={deleteConfirmPassword}
                            onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                            className="axm-form-input"
                            style={{ marginBottom: '30px' }}
                        />
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowDeleteModal(false)} className="axm-btn-outline">Cancel</button>
                            <button onClick={handleDeleteAccount} className="axm-btn-primary" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loader-container">
                    Loading AWIK Profile...
                </div>
            ) : (
                <div className="axm-profile-root">
                    <div className="axm-profile-container">
                        <div className="axm-profile-grid">
                            
                            {/* Sidebar */}
                            <div className="axm-glass-panel axm-sidebar-profile">
                                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                    <ImageUpload
                                        currentImage={user?.profilePicture?.url}
                                        onUpload={handleImageUpload}
                                        isLoading={uploadingImage}
                                    />
                                </div>
                                <h1 className="axm-sidebar-name">{name}</h1>
                                <p className="axm-sidebar-email">
                                    {email}
                                    {(user?.emailVerified || stats?.emailVerified) ?
                                        <FaCheckCircle color="#10B981" title="Verified" /> :
                                        <button onClick={handleVerifyEmail} title="Click to verify" style={{ background: 'none', border: 'none', color: '#F59E0B', cursor: 'pointer' }}>
                                            <FaExclamationTriangle />
                                        </button>
                                    }
                                </p>

                                <button onClick={() => setActiveTab('profile')} className="axm-btn-primary">
                                    Edit Profile
                                </button>

                                <div className="axm-sidebar-nav">
                                    <button onClick={() => setActiveTab('dashboard')} className={`axm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}><FaChartLine /> Dashboard</button>
                                    <button onClick={() => setActiveTab('orders')} className={`axm-nav-item ${activeTab === 'orders' ? 'active' : ''}`}><FaBoxOpen /> Orders</button>
                                    <button onClick={() => setActiveTab('wishlist')} className={`axm-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}><FaHeart /> Wishlist</button>
                                    <button onClick={() => setActiveTab('recentlyViewed')} className={`axm-nav-item ${activeTab === 'recentlyViewed' ? 'active' : ''}`}><FaHistory /> Recently Viewed</button>
                                    <button onClick={() => setActiveTab('settings')} className={`axm-nav-item ${activeTab === 'settings' ? 'active' : ''}`}><FaCog /> Account Settings</button>
                                    
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '15px 0' }}></div>
                                    
                                    <button onClick={() => navigate('/')} className="axm-nav-item" style={{ color: 'var(--orange)' }}><FaStore /> Return to Boutique</button>
                                    <button onClick={logout} className="axm-nav-item"><FaSignOutAlt /> Sign Out</button>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                
                                <AnimatePresence mode="wait">
                                    {message && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', borderRadius: '1rem', fontFamily: 'var(--sans)', fontSize: '0.9rem' }}>
                                            {message}
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', borderRadius: '1rem', fontFamily: 'var(--sans)', fontSize: '0.9rem' }}>
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* DASHBOARD TAB */}
                                {activeTab === 'dashboard' && (
                                    <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {/* Top Stats */}
                                        <div className="axm-stats-grid">
                                            {[
                                                { title: 'Total Orders', value: stats?.totalOrders || 0 },
                                                { title: 'Wishlist Items', value: stats?.wishlistCount || 0 },
                                                { title: 'Total Spent', value: `₹${(stats?.totalSpent || 0).toLocaleString('en-IN')}` }
                                            ].map((stat) => (
                                                <div key={stat.title} className="axm-glass-panel">
                                                    <p className="axm-stat-label">{stat.title}</p>
                                                    <h2 className="axm-stat-value">{stat.value}</h2>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recent Orders */}
                                        <div className="axm-glass-panel" style={{ marginTop: '1.5rem' }}>
                                            <div className="axm-section-header">
                                                <div>
                                                    <h2 className="axm-section-title">Recent Orders</h2>
                                                    <p className="axm-section-desc">Track and manage your latest purchases.</p>
                                                </div>
                                                <button onClick={() => setActiveTab('orders')} className="axm-btn-outline">View All</button>
                                            </div>

                                               {safeOrders.length === 0 ? (
                                                    <p style={{ fontFamily: 'var(--sans)', color: 'var(--muted)', padding: '1.5rem 0', textAlign: 'center' }}>No orders yet.</p>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                                        {safeOrders.slice(0, 3).map((order) => (
                                                            <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    {order.orderItems?.[0]?.image && (
                                                                        <img src={order.orderItems[0].image} alt="" style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '0.4rem', border: '1px solid rgba(255,255,255,0.08)' }} />
                                                                    )}
                                                                    <div>
                                                                        <p style={{ fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--light)', fontSize: '0.85rem', marginBottom: '2px' }}>#LX-{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                                                                        <p style={{ fontFamily: 'var(--sans)', color: 'var(--muted)', fontSize: '0.75rem' }}>{order.orderItems?.length || 0} item(s) · {new Date(order.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <span className={`axm-badge ${order.isDelivered ? 'axm-badge-delivered' : 'axm-badge-processing'}`}>{order.isDelivered ? 'Delivered' : 'Processing'}</span>
                                                                    <p style={{ fontFamily: 'var(--sans)', color: 'var(--orange)', fontWeight: 600, fontSize: '0.9rem' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>

                                        {/* Wishlist + Address */}
                                        <div className="axm-split-grid">
                                            <div className="axm-glass-panel">
                                                <div className="axm-section-header">
                                                    <h2 className="axm-section-title">Wishlist</h2>
                                                    <button onClick={() => setActiveTab('wishlist')} className="axm-btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem' }}>See All</button>
                                                </div>
                                                <div style={{ marginTop: '1rem' }}>
                                                    {safeWishlist.slice(0, 3).map((item) => (
                                                        <div key={item._id} className="axm-list-item">
                                                            <div>
                                                                <p className="axm-list-item-title">{item.name}</p>
                                                                <p className="axm-list-item-sub">Saved for later</p>
                                                            </div>
                                                            <span className="axm-list-item-price">₹{item.price}</span>
                                                        </div>
                                                    ))}
                                                    {safeWishlist.length === 0 && <p className="axm-section-desc">Your wishlist is empty.</p>}
                                                </div>
                                            </div>

                                            <div className="axm-glass-panel">
                                                <h2 className="axm-section-title">Shipping Address</h2>
                                                <div className="axm-address-box">
                                                    <p className="axm-address-name">{name}</p>
                                                    <p className="axm-address-lines">
                                                        {address.street || 'No street provided'}<br />
                                                        {address.city ? `${address.city}, ${address.state}` : 'City, State'} {address.zipCode || ''}<br />
                                                        {address.country || 'Country'}
                                                    </p>
                                                    <button onClick={() => setActiveTab('profile')} className="axm-btn-primary" style={{ marginTop: '1.5rem' }}>Edit Address</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="axm-glass-panel">
                                        <h2 className="axm-section-title" style={{ marginBottom: '1.5rem' }}>Order History</h2>
                                        {safeOrders.length === 0 ? (
                                            <div className="axm-empty-state">
                                                <FaBoxOpen className="axm-empty-icon" />
                                                <p>No orders yet. Start shopping!</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {safeOrders.map((order) => (
                                                    <div key={order._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
                                                        {/* Order header */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                                <div>
                                                                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Order</p>
                                                                    <p style={{ fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--light)', fontSize: '0.9rem' }}>#LX-{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Date</p>
                                                                    <p style={{ fontFamily: 'var(--sans)', color: 'var(--light)', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Total</p>
                                                                    <p style={{ fontFamily: 'var(--sans)', color: 'var(--orange)', fontWeight: 600, fontSize: '0.95rem' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`axm-badge ${order.isDelivered ? 'axm-badge-delivered' : 'axm-badge-processing'}`}>
                                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                                            </span>
                                                        </div>

                                                        {/* Visual Tracking UI */}
                                                        <div style={{ padding: '1.5rem 1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.5rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                                                <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0, transform: 'translateY(-50%)' }}>
                                                                    <div style={{ width: order.isDelivered ? '100%' : '50%', height: '100%', background: '#C9A84C', transition: 'width 0.5s ease' }}></div>
                                                                </div>
                                                                
                                                                {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                                                    let active = false;
                                                                    if (order.isDelivered) active = true;
                                                                    else if (idx <= 1) active = true; // Mock 'Processing' state
                                                                    
                                                                    return (
                                                                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
                                                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: active ? '#C9A84C' : '#333', border: `2px solid ${active ? '#C9A84C' : '#111'}` }}></div>
                                                                            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? '#e8e8e8' : '#666' }}>{step}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Order items */}
                                                        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                            {(order.orderItems || []).map((item, idx) => (
                                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    {item.image && (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}
                                                                        />
                                                                    )}
                                                                    <div style={{ flex: 1 }}>
                                                                        <p style={{ fontFamily: 'var(--sans)', color: 'var(--light)', fontWeight: 500, marginBottom: '4px', fontSize: '0.95rem' }}>{item.name}</p>
                                                                        <p style={{ fontFamily: 'var(--sans)', color: 'var(--muted)', fontSize: '0.8rem' }}>Qty: {item.qty || item.quantity || 1}</p>
                                                                    </div>
                                                                    <p style={{ fontFamily: 'var(--sans)', color: 'var(--light)', fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.9rem' }}>₹{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString('en-IN')}</p>
                                                                </div>
                                                            ))}
                                                            {(!order.orderItems || order.orderItems.length === 0) && (
                                                                <p style={{ fontFamily: 'var(--sans)', color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem 0' }}>No item details available.</p>
                                                            )}
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                                <button 
                                                                    onClick={() => handleReorder(order.orderItems)}
                                                                    style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C', padding: '0.4rem 1rem', fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
                                                                >
                                                                    Buy Again
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="axm-glass-panel">
                                        <h2 className="axm-section-title" style={{ marginBottom: '1.5rem' }}>Edit Profile</h2>
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="axm-form-grid">
                                                <div className="axm-form-group">
                                                    <label className="axm-form-label">Full Name</label>
                                                    <input type="text" className="axm-form-input" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                                <div className="axm-form-group">
                                                    <label className="axm-form-label">Email Address</label>
                                                    <input type="email" className="axm-form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div className="axm-form-group">
                                                    <label className="axm-form-label">Phone Number</label>
                                                     <input type="text" className="axm-form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                </div>
                                            </div>

                                            <h2 className="axm-section-title" style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Shipping Address</h2>
                                            <div className="axm-form-group">
                                                <input type="text" className="axm-form-input" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                                            </div>
                                            <div className="axm-form-grid">
                                                <input type="text" className="axm-form-input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                                <input type="text" className="axm-form-input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                            </div>
                                            <div className="axm-form-grid" style={{ marginTop: '1rem' }}>
                                                <input type="text" className="axm-form-input" placeholder="Zip / Postal Code" value={address.zipCode || ''} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                                                <input type="text" className="axm-form-input" placeholder="Country" value={address.country || ''} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                                            </div>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                                <button type="submit" className="axm-btn-primary" style={{ width: 'auto', padding: '1rem 3rem' }}>Save Changes</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* WISHLIST TAB */}
                                {activeTab === 'wishlist' && (
                                    <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="axm-glass-panel">
                                        <h2 className="axm-section-title" style={{ marginBottom: '1.5rem' }}>My Wishlist</h2>
                                        {safeWishlist.length === 0 ? (
                                            <div className="axm-empty-state">
                                                <FaHeart className="axm-empty-icon" />
                                                <p>Your wishlist is empty.</p>
                                                <button onClick={() => navigate('/')} className="axm-btn-outline" style={{ marginTop: '1rem' }}>Explore Collection</button>
                                            </div>
                                        ) : (
                                            <div className="axm-split-grid">
                                                {safeWishlist.map(item => (
                                                    <div key={item._id} className="axm-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                                                        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
                                                            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                                            <div style={{ flex: 1 }}>
                                                                <p className="axm-list-item-title">{item.name}</p>
                                                                <span className="axm-list-item-price" style={{ fontSize: '1rem' }}>₹{item.price}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                            <button onClick={() => navigate(`/product/${item._id}`)} className="axm-btn-outline" style={{ flex: 1 }}>View</button>
                                                            <button onClick={() => handleRemoveFromWishlist(item._id)} className="axm-btn-outline" style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}><FaTrash /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* RECENTLY VIEWED TAB */}
                                {activeTab === 'recentlyViewed' && (
                                    <motion.div key="recentlyViewed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="axm-glass-panel">
                                        <h2 className="axm-section-title" style={{ marginBottom: '1.5rem' }}>Recently Viewed</h2>
                                        {safeRecentlyViewed.length === 0 ? (
                                            <div className="axm-empty-state">
                                                <FaHistory className="axm-empty-icon" />
                                                <p>No recently viewed products.</p>
                                            </div>
                                        ) : (
                                            <div className="axm-split-grid">
                                                {safeRecentlyViewed.map(item => (
                                                    <div key={item._id} className="axm-list-item" onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                                                        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
                                                            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                                            <div style={{ flex: 1 }}>
                                                                <p className="axm-list-item-title">{item.name}</p>
                                                                <span className="axm-list-item-price" style={{ fontSize: '1rem' }}>₹{item.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* SETTINGS TAB */}
                                {activeTab === 'settings' && (
                                    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="axm-glass-panel">
                                        <h2 className="axm-section-title" style={{ marginBottom: '2rem' }}>Settings & Privacy</h2>
                                        
                                        <div style={{ marginBottom: '3rem' }}>
                                            <h3 className="axm-section-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaLock color="var(--orange)" /> Security</h3>
                                            
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p className="axm-list-item-title">Two-Factor Authentication</p>
                                                    <p className="axm-list-item-sub">Secure your account with email OTP.</p>
                                                </div>
                                                <div onClick={handleToggle2FA} style={{ width: '50px', height: '26px', background: twoFactorEnabled ? 'var(--orange)' : '#333', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: twoFactorEnabled ? '27px' : '3px', transition: 'left 0.3s ease' }} />
                                                </div>
                                            </div>

                                            <form onSubmit={handlePasswordChange}>
                                                <div className="axm-form-group">
                                                    <input type="password" placeholder="Current Password" className="axm-form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                                </div>
                                                <div className="axm-form-group">
                                                    <input type="password" placeholder="New Password" className="axm-form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                                </div>
                                                <div className="axm-form-group">
                                                    <input type="password" placeholder="Confirm New Password" className="axm-form-input" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                                                </div>
                                                <button type="submit" className="axm-btn-primary" style={{ width: 'auto', padding: '1rem 2rem' }}>Update Password</button>
                                            </form>
                                        </div>


                                            <h3 className="axm-section-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2rem' }}><FaBoxOpen color="var(--orange)" /> Notifications</h3>
                                            
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p className="axm-list-item-title">Email Notifications</p>
                                                    <p className="axm-list-item-sub">Receive updates on orders and exclusive collections.</p>
                                                </div>
                                                <div onClick={() => setEmailNotif(!emailNotif)} style={{ width: '50px', height: '26px', background: emailNotif ? 'var(--orange)' : '#333', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: emailNotif ? '27px' : '3px', transition: 'left 0.3s ease' }} />
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p className="axm-list-item-title">SMS Notifications</p>
                                                    <p className="axm-list-item-sub">Get real-time tracking updates via text message.</p>
                                                </div>
                                                <div onClick={() => setSmsNotif(!smsNotif)} style={{ width: '50px', height: '26px', background: smsNotif ? 'var(--orange)' : '#333', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease' }}>
                                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: smsNotif ? '27px' : '3px', transition: 'left 0.3s ease' }} />
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                                            <h3 className="axm-section-title" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '10px' }}><FaShieldAlt /> Danger Zone</h3>
                                            <p className="axm-section-desc" style={{ marginBottom: '1.5rem' }}>Permanently delete your account and all associated data.</p>
                                            <button onClick={() => setShowDeleteModal(true)} className="axm-btn-outline" style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                                                <FaTrash style={{ marginRight: '5px' }} /> Delete Account
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;
