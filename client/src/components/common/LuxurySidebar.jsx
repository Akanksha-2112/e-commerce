import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LuxurySidebar.css';
import womenImg from '../../assets/nav_women.png';
import menImg from '../../assets/nav_men.png';
import kidsImg from '../../assets/nav_kids.png';
import { useGlobal } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';

const LuxurySidebar = () => {
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useGlobal();
    const { user } = useContext(AuthContext);

    const onClose = () => toggleSidebar(false);

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            <div className={`luxury-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={onClose}></div>

            <div className={`luxury-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="luxury-close" onClick={onClose}>&times;</button>

                {/* Women */}
                <div className="luxury-menu-item" onClick={() => handleNavigate('/sarees')}>
                    <img src={womenImg} alt="Women" className="luxury-thumb" />
                    <div className="luxury-content">
                        <div className="luxury-category">WOMEN</div>
                        <div className="luxury-subcategories">
                            <span>Frocks,</span> <span>Skirts,</span> <span>T-shirts,</span> <span>Dresses</span>
                        </div>
                    </div>
                </div>

                {/* Men */}
                <div className="luxury-menu-item" onClick={() => handleNavigate('/sarees')}>
                    <img src={menImg} alt="Men" className="luxury-thumb" />
                    <div className="luxury-content">
                        <div className="luxury-category">MEN</div>
                        <div className="luxury-subcategories">
                            <span>Suits,</span> <span>Shirts,</span> <span>Trousers,</span> <span>Jackets</span>
                        </div>
                    </div>
                </div>

                {/* Kids */}
                <div className="luxury-menu-item" onClick={() => handleNavigate('/sarees')}>
                    <img src={kidsImg} alt="Kids" className="luxury-thumb" />
                    <div className="luxury-content">
                        <div className="luxury-category">KIDS</div>
                        <div className="luxury-subcategories">
                            <span>Girls,</span> <span>Boys,</span> <span>Baby,</span> <span>Accessories</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="luxury-footer">
                    <div className="luxury-footer-link" onClick={() => handleNavigate(user ? '/profile' : '/login')}>
                        <FaUser size={16} />
                        {user ? (user.firstName || user.name?.split(' ')[0] || "Account") : "Sign In"}
                    </div>
                    <div className="luxury-footer-link" onClick={() => handleNavigate('/wishlist')}>
                        <FaHeart size={16} />
                        Wishlist
                    </div>
                    <div className="luxury-footer-link" onClick={() => handleNavigate('/cart')}>
                        <FaShoppingBag size={16} />
                        Bag
                    </div>
                </div>
            </div>
        </>
    );
};

export default LuxurySidebar;
