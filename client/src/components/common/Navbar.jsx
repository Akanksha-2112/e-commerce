import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Adjust path if your structure is different

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img
            src={logo}
            alt="Company Logo"
            style={{
              height: '48px',
              marginRight: '12px',
              verticalAlign: 'middle',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          />
        </div>
      </div>
      <div className="auth-buttons">
        <Link to="/login"><button>Sign In</button></Link>
        <Link to="/register"><button>Sign Up</button></Link>
      </div>
    </nav>
  );
};

export default Navbar;
