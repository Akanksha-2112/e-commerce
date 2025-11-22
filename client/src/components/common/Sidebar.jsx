import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const categories = [
    {
      name: 'Men',
      path: '/category/men',
      subcategories: ['Shirts', 'Pants', 'T-Shirts', 'Jackets', 'Traditional Wear']
    },
    {
      name: 'Women',
      path: '/category/women',
      subcategories: ['Dresses', 'Tops', 'Sarees', 'Lehengas', 'Western Wear']
    },
    {
      name: 'Kids',
      path: '/category/kids',
      subcategories: ['Boys', 'Girls', 'Infants', 'School Wear']
    }
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {categories.map((category) => (
            <div key={category.name} className="category-section">
              <Link to={category.path} className="category-title" onClick={onClose}>
                {category.name}
              </Link>
              <ul className="subcategory-list">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link 
                      to={`${category.path}?subcategory=${sub.toLowerCase().replace(' ', '-')}`}
                      onClick={onClose}
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
