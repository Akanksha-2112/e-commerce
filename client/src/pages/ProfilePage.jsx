import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useGlobal } from '../context/GlobalContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../components/common/ImageUpload';
import SovereignTabs from '../components/common/SovereignTabs';
import '../styles/ProfilePage.css'; // Import the new Premium CSS
import {
    FaUser,
    FaBoxOpen,
    FaSignOutAlt,
    FaShoppingBag,
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

    const { toggleSidebar } = useGlobal();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [stats, setStats] = useState(null);
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
    }, [user, loading, navigate]);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders', config);
            setOrders(data);
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
            setWishlist(result.data);
        }
    };

    const fetchRecentlyViewedData = async () => {
        const result = await getRecentlyViewed();
        if (result.success) {
            setRecentlyViewed(result.data);
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
                'http://localhost:5000/api/auth/profile',
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
                'http://localhost:5000/api/auth/profile',
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
            setWishlist(wishlist.filter(item => item._id !== productId));
            setMessage('Removed from wishlist');
            setTimeout(() => setMessage(''), 2000);
        } else {
            setError(result.message);
        }
    };

    // Animation Variants
    const sidebarVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    const contentVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
    };

    const NavLink = ({ tab, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    return (
        <>
            {/* Delete Account Modal - Styled to match premium theme */}
            {showDeleteModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--surface-glass)',
                        border: 'var(--border-thin)',
                        padding: '40px',
                        borderRadius: '4px',
                        width: '90%',
                        maxWidth: '450px',
                        boxShadow: 'var(--shadow-soft)'
                    }}>
                        <h3 style={{ color: '#EF4444', fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: "'Playfair Display', serif" }}>
                            <FaExclamationTriangle /> Delete Account?
                        </h3>
                        <p style={{ color: 'var(--luxury-grey)', marginBottom: '30px', lineHeight: '1.6' }}>
                            This action is permanent and cannot be undone. All your data will be erased from our exclusive records.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter password to confirm"
                            value={deleteConfirmPassword}
                            onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 0',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                marginBottom: '30px',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowDeleteModal(false)} style={{ padding: '12px 25px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: 'var(--luxury-grey)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Cancel</button>
                            <button onClick={handleDeleteAccount} style={{ padding: '12px 25px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Delete Forever</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="loader-container">
                    Loading AWIK Profile...
                </div>
            ) : (
                <div className="profile-page-container">

                    {/* [NEW] Sovereign Navigation Overlay */}
                    <header className="vertical-header" style={{ position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
                        <img
                            src={require('../assets/images/logo.png')}
                            alt="Logo"
                            className="header-logo"
                            onClick={() => navigate('/')}
                        />

                        <button className="menu-trigger" onClick={() => toggleSidebar(true)}>
                            <span className="menu-line"></span>
                            <span className="menu-line"></span>
                            <span className="menu-line"></span>
                        </button>
                    </header>

                    <SovereignTabs />

                    <div className="greeting-container">
                        <span style={{ cursor: 'default' }}>
                            Hello, {name.split(' ')[0]}
                        </span>
                    </div>

                    <div className="profile-content-wrapper">

                        {/* Sidebar */}
                        <motion.div variants={sidebarVariants} initial="hidden" animate="visible" className="profile-sidebar">
                            <div className="user-info-section">
                                <ImageUpload
                                    currentImage={user?.profilePicture?.url}
                                    onUpload={handleImageUpload}
                                    isLoading={uploadingImage}
                                />
                                <h2 className="user-name">{name}</h2>
                                <p className="user-email">
                                    {email}
                                    {(user?.emailVerified || stats?.emailVerified) ?
                                        <FaCheckCircle className="verify-badge" title="Verified" /> :
                                        <button className="verify-btn" onClick={handleVerifyEmail} title="Click to verify">
                                            <FaExclamationTriangle size={14} style={{ marginLeft: '6px' }} />
                                        </button>
                                    }
                                </p>
                            </div>

                            <nav className="nav-section">
                                <NavLink tab="dashboard" icon={FaChartLine} label="Command Center" />
                                <NavLink tab="profile" icon={FaUser} label="My Profile" />
                                <NavLink tab="orders" icon={FaBoxOpen} label="Orders" />
                                <NavLink tab="wishlist" icon={FaHeart} label="Wishlist" />
                                <NavLink tab="recentlyViewed" icon={FaHistory} label="Recently Viewed" />
                                <NavLink tab="settings" icon={FaCog} label="Settings" />

                                {/* Divider */}
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '15px 0' }}></div>

                                <button
                                    className="nav-link"
                                    onClick={() => navigate('/')}
                                    style={{ color: 'var(--luxury-gold)' }}
                                >
                                    <FaStore size={18} /> Return to Boutique
                                </button>
                            </nav>

                            <div className="sign-out-section">
                                <button onClick={logout} className="sign-out-btn">
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        </motion.div>

                        {/* Content Area */}
                        <div className="main-content">
                            <AnimatePresence mode="wait">
                                {message && (
                                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', borderRadius: '14px', fontWeight: '500', backdropFilter: 'blur(5px)' }}>
                                        {message}
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', borderRadius: '14px', fontWeight: '500', backdropFilter: 'blur(5px)' }}>
                                        {error}
                                    </motion.div>
                                )}

                                {/* DASHBOARD TAB */}
                                {activeTab === 'dashboard' && (
                                    <motion.div key="dashboard" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                        <h2 className="section-title">Vault Status</h2>
                                        <div className="dashboard-grid">
                                            {[
                                                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FaBoxOpen },
                                                { label: 'Collection Value', value: `₹${stats?.totalSpent || 0}`, icon: FaShoppingBag },
                                                { label: 'In Wishlist', value: stats?.wishlistCount || 0, icon: FaHeart }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="stat-card">
                                                    <div className="stat-icon">
                                                        <stat.icon />
                                                    </div>
                                                    <div className="stat-info">
                                                        <div className="label">{stat.label}</div>
                                                        <div className="value">{stat.value}</div>
                                                    </div>
                                                </div>
                                            ))
                                            }
                                        </div>

                                        <h3 className="activity-section-title">Recent Activity</h3>
                                        {orders.slice(0, 2).map(order => (
                                            <div key={order._id} className="order-card">
                                                <div className="order-header">
                                                    <div>
                                                        <div className="order-id">Order #{order._id.substring(order._id.length - 6)}</div>
                                                        <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="order-price">₹{order.totalPrice}</div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div className="order-items">
                                                        {order.orderItems.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="order-item-badge">{item.qty}x {item.name}</div>
                                                        ))}
                                                        {order.orderItems.length > 3 && <div className="order-item-badge">+{order.orderItems.length - 3} more</div>}
                                                    </div>
                                                    <span className={`order-status ${order.isDelivered ? 'status-delivered' : 'status-processing'}`}>
                                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* PROFILE TAB */}
                                {activeTab === 'profile' && (
                                    <motion.div key="profile" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="form-container">
                                        <h2 className="section-title">Edit Profile</h2>
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Full Name</label>
                                                    <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Email Address</label>
                                                    <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Phone Number</label>
                                                    <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>Shipping Address</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '30px' }}>
                                                <div className="form-group">
                                                    <input type="text" className="form-input" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                    <input type="text" className="form-input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                                    <input type="text" className="form-input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <button type="submit" className="primary-btn">Save Changes</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <motion.div key="orders" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                        <h2 className="section-title">Order History</h2>
                                        {(orders.length === 0) ? (
                                            <div className="empty-state">
                                                <FaBoxOpen className="empty-icon" />
                                                <p className="empty-text">You haven't placed any orders yet.</p>
                                            </div>
                                        ) : (
                                            orders.map(order => (
                                                <div key={order._id} className="order-card">
                                                    <div className="order-header">
                                                        <div>
                                                            <div className="order-id">Order #{order._id}</div>
                                                            <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                        <div className="order-price">₹{order.totalPrice}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div className="order-items">
                                                            {order.orderItems.map((item, i) => (
                                                                <span key={i} className="order-item-badge">{item.qty}x {item.name}</span>
                                                            ))}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <span className={`order-status ${order.isPaid ? 'status-paid' : 'status-unpaid'}`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                                                            <span className={`order-status ${order.isDelivered ? 'status-delivered' : 'status-processing'}`}>{order.isDelivered ? 'Delivered' : 'Processing'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}

                                {/* WISHLIST TAB */}
                                {activeTab === 'wishlist' && (
                                    <motion.div key="wishlist" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                        <h2 className="section-title">My Wishlist</h2>
                                        {wishlist.length === 0 ? (
                                            <div className="empty-state">
                                                <FaHeart className="empty-icon" />
                                                <p className="empty-text">Your wishlist is empty.</p>
                                                <button onClick={() => navigate('/')} className="primary-btn" style={{ marginTop: '20px' }}>Explore Collection</button>
                                            </div>
                                        ) : (
                                            <div className="products-grid">
                                                {wishlist.map(item => (
                                                    <div key={item._id} className="product-card">
                                                        <div className="product-image-container">
                                                            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/200'} alt={item.name} className="product-image" />
                                                        </div>
                                                        <h3 className="product-name">{item.name}</h3>
                                                        <p className="product-price">₹{item.price}</p>
                                                        <div className="card-actions">
                                                            <button onClick={() => navigate(`/product/${item._id}`)} className="action-btn view">View Item</button>
                                                            <button onClick={() => handleRemoveFromWishlist(item._id)} className="action-btn remove"><FaTrash /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* RECENTLY VIEWED TAB */}
                                {activeTab === 'recentlyViewed' && (
                                    <motion.div key="recentlyViewed" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                        <h2 className="section-title">Recently Viewed</h2>
                                        {recentlyViewed.length === 0 ? (
                                            <div className="empty-state">
                                                <FaHistory className="empty-icon" />
                                                <p className="empty-text">No recently viewed products.</p>
                                            </div>
                                        ) : (
                                            <div className="products-grid">
                                                {recentlyViewed.map(item => (
                                                    <div key={item._id} className="product-card" onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: 'pointer' }}>
                                                        <div className="product-image-container">
                                                            <img src={item.images?.[0]?.url || 'https://via.placeholder.com/200'} alt={item.name} className="product-image" />
                                                        </div>
                                                        <h3 className="product-name">{item.name}</h3>
                                                        <p className="product-price">₹{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* SETTINGS TAB */}
                                {activeTab === 'settings' && (
                                    <motion.div key="settings" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="form-container">
                                        <h2 className="section-title">Settings & Privacy</h2>

                                        <div className="settings-section">
                                            <h3 className="settings-title"><FaLock color="var(--luxury-gold)" /> Security</h3>

                                            {/* 2FA Toggle */}
                                            <div className="form-group" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div>
                                                    <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '5px' }}>Two-Factor Authentication</label>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Secure your account with email OTP.</span>
                                                </div>
                                                <div
                                                    onClick={handleToggle2FA}
                                                    style={{
                                                        width: '50px', height: '26px',
                                                        background: twoFactorEnabled ? '#10B981' : '#333',
                                                        borderRadius: '20px',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.3s ease'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '20px', height: '20px',
                                                        background: '#fff',
                                                        borderRadius: '50%',
                                                        position: 'absolute',
                                                        top: '3px',
                                                        left: twoFactorEnabled ? '27px' : '3px',
                                                        transition: 'left 0.3s ease',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }} />
                                                </div>
                                            </div>

                                            <div style={{ maxWidth: '400px' }}>
                                                <form onSubmit={handlePasswordChange}>
                                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                                        <input type="password" placeholder="Current Password" className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                                        <input type="password" placeholder="New Password" className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                                        <input type="password" placeholder="Confirm New Password" className="form-input" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                                                    </div>
                                                    <button type="submit" className="primary-btn">Update Password</button>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="settings-section" style={{ border: 'none', paddingBottom: 0 }}>
                                            <h3 className="settings-title" style={{ color: '#EF4444' }}><FaShieldAlt /> Danger Zone</h3>
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Permanently delete your account and all associated data.</p>
                                            <button onClick={() => setShowDeleteModal(true)} className="danger-zone-btn">
                                                <FaTrash /> Delete Account
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;
