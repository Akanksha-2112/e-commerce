import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import '../styles/HomePage.css';

const navItems = [
  { label: 'MEN', path: '/men' },
  { label: 'WOMEN', path: '/women' },
  { label: 'KIDS', path: '/kids' },
  { label: 'HOME', path: '/home' },
  { label: 'BEAUTY', path: '/beauty' },
  { label: 'GENZ', path: '/genz' },
  { label: 'STUDIO', path: '/studio', new: true }
];

const actionIcons = [
  { icon: <FiUser />, label: 'Profile', path: '/profile' },
  { icon: <FiHeart />, label: 'Wishlist', path: '/wishlist' },
  { icon: <FiShoppingBag />, label: 'Bag', path: '/cart' }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="hp-navbar-root">
      <div className="hp-navbar-main">
        {/* Logo */}
        <img src={logo} alt="AWIK Spectrum" className="hp-navbar-logo" />

        {/* Horizontal Menu */}
        <ul className="hp-navbar-menu">
          {navItems.map(item => (
            <li key={item.label} onClick={() => navigate(item.path)}>
              {item.label}
              {item.new && <span className="hp-navbar-badge">NEW</span>}
            </li>
          ))}
        </ul>

        {/* Search */}
        <input
          className="hp-navbar-search"
          placeholder="Search for products, brands and more"
        />

        {/* Profile, Wishlist, Bag */}
        <div className="hp-navbar-actions">
          {actionIcons.map(a => (
            <div
              key={a.label}
              className="hp-navbar-action"
              onClick={() => navigate(a.path)}
            >
              {a.icon}
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner (edit or remove as you wish) */}
      <div className="hp-navbar-banner">
        <b>FLAT ₹300 OFF</b>
        <span className="hp-navbar-offer-detail">On Your 1<sup>st</sup> Purchase</span>
      </div>
    </div>
  );
};

export default HomePage;
