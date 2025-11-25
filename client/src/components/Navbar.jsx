import React from "react";
import { FaRegUser, FaRegHeart, FaShoppingBag, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import "./Navbar.css";

export default function Navbar() {
    const { getCartCount, getWishlistCount } = useGlobal();

    const cartCount = getCartCount();
    const wishlistCount = getWishlistCount();

    return (
        <header className="navbar">
            <div className="navbar-left">
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
                        <Link to="/design/lehenga" className="dropdown-link">Lehengas</Link>
                        <Link to="/design/saree" className="dropdown-link">Sarees</Link>
                        <Link to="/design/kurti" className="dropdown-link">Kurtis</Link>
                        <Link to="/design/tops" className="dropdown-link">Tops</Link>
                        <Link to="/design/dresses" className="dropdown-link">Dresses</Link>
                        <Link to="/design/skirts" className="dropdown-link">Skirts</Link>
                    </div>
                </div>
                <div className="nav-item">
                    <Link to="/kids" className="navbar-link">KIDS</Link>
                    <div className="dropdown-menu">
                        <Link to="/design/kids/boys" className="dropdown-link">Boys</Link>
                        <Link to="/design/kids/girls" className="dropdown-link">Girls</Link>
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
                <Link to="/profile" className="icon-box">
                    <FaRegUser className="navbar-icon" />
                    <span>Profile</span>
                </Link>
                <Link to="/wishlist" className="icon-box">
                    <FaRegHeart className="navbar-icon" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                </Link>
                <Link to="/cart" className="icon-box">
                    <FaShoppingBag className="navbar-icon" />
                    <span>Bag</span>
                    {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </Link>
            </div>
        </header>
    );
}
