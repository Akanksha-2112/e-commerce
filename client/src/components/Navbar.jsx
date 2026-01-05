import React, { useContext } from "react";
import { FaRegUser, FaRegHeart, FaShoppingBag, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";



export default function Navbar() {
    const { getCartCount, getWishlistCount, toggleSidebar, toggleCart } = useGlobal();
    const { user } = useContext(AuthContext);

    const cartCount = getCartCount();
    const wishlistCount = getWishlistCount();

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="navbar-menu-btn" onClick={() => toggleSidebar(true)}>
                    <span className="menu-text">MENU</span>
                </button>
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="navbar-logo" />
                </Link>
            </div>
            <nav className="navbar-center">
                <div className="nav-item">
                    <Link to="/men" className="navbar-link">MEN</Link>
                    <div className="dropdown-menu">
                        <Link to="/men/shirts" className="dropdown-link">Shirts</Link>
                        <Link to="/men/tshirts" className="dropdown-link">T-Shirts</Link>
                        <Link to="/men/jeans" className="dropdown-link">Jeans</Link>
                    </div>
                </div>
                <div className="nav-item">
                    <Link to="/women" className="navbar-link">WOMEN</Link>
                    <div className="dropdown-menu">
                        <Link to="/women/sarees" className="dropdown-link">Sarees</Link>
                        <Link to="/women/lehengas" className="dropdown-link">Lehengas</Link>
                        <Link to="/women/kurtis" className="dropdown-link">Kurtis</Link>
                        <Link to="/women/tops" className="dropdown-link">Tops</Link>
                        <Link to="/women/dresses" className="dropdown-link">Dresses</Link>
                    </div>
                </div>
                <div className="nav-item">
                    <Link to="/kids" className="navbar-link">KIDS</Link>
                    <div className="dropdown-menu">
                        <Link to="/kids/Boys%20Kurtas" className="dropdown-link">Boys Kurtas</Link>
                        <Link to="/kids/Boys%20Sherwanis" className="dropdown-link">Boys Sherwanis</Link>
                        <Link to="/kids/Boys%20Suits" className="dropdown-link">Boys Suits</Link>
                        <Link to="/kids/Girls%20Lehengas" className="dropdown-link">Girls Lehengas</Link>
                        <Link to="/kids/Girls%20Shararas" className="dropdown-link">Girls Shararas</Link>
                        <Link to="/kids/Girls%20Gowns" className="dropdown-link">Girls Gowns</Link>
                    </div>
                </div>
                <div className="nav-item">
                    <Link to="/studio" className="navbar-link">STUDIO <span className="new-label">NEW</span></Link>
                </div>
            </nav>
            <div className="navbar-right">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for products, brands and more"
                    />
                </div>
                <Link to={user ? "/profile" : "/login"} className="icon-box">
                    <FaRegUser className="navbar-icon" />
                    <span>{user ? `Hello, ${user.firstName}` : "Sign In"}</span>
                </Link>
                <Link to="/wishlist" className="icon-box">
                    <FaRegHeart className="navbar-icon" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                </Link>
                <button className="icon-box" onClick={() => toggleCart(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaShoppingBag className="navbar-icon" />
                    <span>Bag</span>
                    {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </button>
            </div>
        </header>
    );
}
