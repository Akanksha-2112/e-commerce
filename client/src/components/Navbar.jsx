import React, { useContext, useState, useEffect, useRef } from "react";
import { FaBars, FaRegUser, FaRegHeart, FaShoppingBag, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config";
import "./Navbar.css";

export default function Navbar() {
    const { getCartCount, getWishlistCount, toggleSidebar, toggleCart } = useGlobal();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const cartCount = getCartCount();
    const wishlistCount = getWishlistCount();

    // ── Search overlay state ──────────────────────────────────────
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    // Focus input when overlay opens
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => inputRef.current?.focus(), 80);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [searchOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Debounced live search
    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(debounceRef.current);
        if (!val.trim()) { setResults([]); return; }
        setSearching(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/api/products?search=${encodeURIComponent(val)}&limit=8`);
                setResults(data.products || data || []);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
    };

    const handleResultClick = (product) => {
        setSearchOpen(false);
        navigate(`/product/${product._id}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchOpen(false);
            navigate(`/?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <>
            <header className="navbar">
                <div className="navbar-left">
                    <button className="navbar-menu-btn" onClick={() => toggleSidebar(true)} aria-label="Open menu">
                        <FaBars aria-hidden="true" />
                        <span className="menu-text">MENU</span>
                    </button>
                    <Link to="/" className="navbar-brand" aria-label="AWIK Spectrum home">
                        <img src="/logo.png" alt="Logo" className="navbar-logo" />
                        <span className="navbar-brand-copy">
                            <strong>AWIK</strong>
                            <span>Spectrum</span>
                        </span>
                    </Link>
                </div>
                <nav className="navbar-center">
                    <div className="nav-item">
                        <Link to="/men" className="navbar-link">MEN</Link>
                        <div className="dropdown-menu">
                            <Link to="/men/Shirts" className="dropdown-link">Shirts</Link>
                            <Link to="/men/Pants" className="dropdown-link">Pants</Link>
                            <Link to="/men/Jackets" className="dropdown-link">Jackets</Link>
                            <Link to="/men/Suits" className="dropdown-link">Suits</Link>
                        </div>
                    </div>
                    <div className="nav-item">
                        <Link to="/women" className="navbar-link">WOMEN</Link>
                        <div className="dropdown-menu">
                            <Link to="/women/Sarees" className="dropdown-link">Sarees</Link>
                            <Link to="/women/Lehengas" className="dropdown-link">Lehengas</Link>
                            <Link to="/women/Kurtis" className="dropdown-link">Kurtis</Link>
                            <Link to="/women/Tops" className="dropdown-link">Tops</Link>
                            <Link to="/women/Dresses" className="dropdown-link">Dresses</Link>
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
                        <Link to="/maison" className="navbar-link">MAISON <span className="new-label">NEW</span></Link>
                    </div>
                </nav>
                <div className="navbar-right">
                    {/* Search trigger — now a real clickable button */}
                    <button
                        className="search-container"
                        onClick={() => setSearchOpen(true)}
                        aria-label="Open search"
                        type="button"
                    >
                        <FaSearch className="search-icon" />
                        <span className="search-input-placeholder">Search collections</span>
                    </button>

                    <Link to={user ? "/profile" : "/login"} className="icon-box">
                        <FaRegUser className="navbar-icon" />
                        <span>{user ? `Hello, ${user.firstName || user.name?.split(' ')[0]}` : "Sign In"}</span>
                    </Link>
                    <Link to="/wishlist" className="icon-box">
                        <FaRegHeart className="navbar-icon" />
                        <span>Wishlist</span>
                        {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                    </Link>
                    <button className="icon-box navbar-bag-btn" onClick={() => toggleCart(true)} aria-label="Open shopping bag">
                        <FaShoppingBag className="navbar-icon" />
                        <span>Bag</span>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </button>
                </div>
            </header>

            {/* ── Full-screen Search Overlay ─────────────────────── */}
            {searchOpen && (
                <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
                    <div className="search-overlay-backdrop" onClick={() => setSearchOpen(false)} />
                    <div className="search-overlay-panel">
                        <form onSubmit={handleSearchSubmit} className="search-overlay-form">
                            <FaSearch className="search-overlay-icon" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="search-overlay-input"
                                placeholder="Search for sarees, lehengas, shirts…"
                                value={query}
                                onChange={handleQueryChange}
                                autoComplete="off"
                            />
                            {query && (
                                <button type="button" className="search-overlay-clear" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}>
                                    <FaTimes size={14} />
                                </button>
                            )}
                            <button type="button" className="search-overlay-close" onClick={() => setSearchOpen(false)}>
                                <FaTimes size={18} />
                            </button>
                        </form>

                        <div className="search-overlay-results">
                            {searching && <p className="search-overlay-hint">Searching…</p>}
                            {!searching && query && results.length === 0 && (
                                <p className="search-overlay-hint">No results for "<strong>{query}</strong>"</p>
                            )}
                            {!query && (
                                <p className="search-overlay-hint">Start typing to discover pieces from the collection.</p>
                            )}
                            {results.map((product) => (
                                <button
                                    key={product._id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(product)}
                                    type="button"
                                >
                                    {product.images?.[0]?.url && (
                                        <img src={product.images[0].url} alt={product.name} className="search-result-img" />
                                    )}
                                    <div className="search-result-info">
                                        <p className="search-result-name">{product.name}</p>
                                        <p className="search-result-meta">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</p>
                                    </div>
                                    <p className="search-result-price">
                                        ₹{(product.price || 0).toLocaleString('en-IN')}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
