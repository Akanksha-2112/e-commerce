import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FixedNavigation = () => {
    const navigate = useNavigate();
    const [isWomenOpen, setIsWomenOpen] = useState(false);
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, []);

    // Styles
    const sidebarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '280px',
        height: '100vh',
        backgroundColor: '#fcfcfc', // Matte off-white
        padding: '60px 0 0 60px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        borderRight: '1px solid rgba(0,0,0,0.03)'
    };

    const logoStyle = {
        fontFamily: "'Didot', 'Playfair Display', serif",
        fontSize: '1.8rem',
        letterSpacing: '0.1em',
        marginBottom: '80px',
        cursor: 'pointer',
        color: '#000'
    };

    const menuListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '25px'
    };

    const menuItemStyle = {
        fontFamily: "'Montserrat', 'Jost', sans-serif",
        fontSize: '0.9rem',
        letterSpacing: '0.2em',
        color: '#000',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease',
        opacity: 0.6,
        textTransform: 'uppercase'
    };

    const accountItemStyle = {
        ...menuItemStyle,
        fontFamily: "'Playfair Display', serif",
        textTransform: 'none',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        marginTop: '20px',
        color: '#1A1A1A',
        opacity: 0.8
    };

    const subMenuStyle = {
        listStyle: 'none',
        padding: '15px 0 0 20px',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    };

    const subMenuItemStyle = {
        fontFamily: "'Montserrat', 'Jost', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        color: '#333',
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.3s ease'
    };

    return (
        <div style={sidebarStyle}>
            <div style={logoStyle} onClick={() => navigate('/')}>
                <img src="/logo.png" alt="AWIK" style={{ height: '40px', objectFit: 'contain' }} />
            </div>

            <ul style={menuListStyle}>
                <li
                    style={accountItemStyle}
                    onClick={() => navigate(user ? '/account' : '/entrance')}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.8}
                >
                    {user?.firstName ? `Hello, ${user.firstName}` : 'Access Your Profile'}
                </li>

                <li
                    style={menuItemStyle}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                >
                    NEW ARRIVALS
                </li>

                <li
                    style={{ ...menuItemStyle, opacity: isWomenOpen ? 1 : 0.6 }}
                    onClick={() => setIsWomenOpen(!isWomenOpen)}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => !isWomenOpen && (e.target.style.opacity = 0.6)}
                >
                    WOMEN
                </li>

                <AnimatePresence>
                    {isWomenOpen && (
                        <motion.ul
                            style={subMenuStyle}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Cubic-bezier
                        >
                            {['Dresses', 'Frocks', 'Skirts', 'T-shirts'].map((item) => (
                                <motion.li
                                    key={item}
                                    style={subMenuItemStyle}
                                    whileHover={{ opacity: 1, x: 5 }}
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>

                <li
                    style={menuItemStyle}
                    onClick={() => navigate('/men')}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                >
                    MEN
                </li>
                <li
                    style={menuItemStyle}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                >
                    KIDS
                </li>
                <li
                    style={menuItemStyle}
                    onClick={() => navigate('/maison')}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                >
                    MAISON
                </li>
            </ul>
        </div>
    );
};

export default FixedNavigation;
