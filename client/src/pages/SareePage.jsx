import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import ArchiveCard from '../components/common/ArchiveCard';
import sareeImg from '../assets/products/saree1.jpg';
import '../styles/PrivateArchive.css';

// Mock Data with "Masterpiece" and Grid Items
const masterpiece = {
  id: 'master',
  name: 'The Royal Banarasi Heirloom',
  image: sareeImg, // In real app, use a high-res hero version
  origin: '19th Century Weave Revival'
};

const products = [
  {
    id: 1,
    name: 'Crimson Gold Katan',
    image: sareeImg,
    origin: 'Banaras Hand-Loom',
    price: 450000,
    span: 'tall'
  },
  {
    id: 2,
    name: 'Midnight Silk Organza',
    image: sareeImg,
    origin: 'Chanderi Weave',
    price: 285000,
    span: 'wide'
  },
  {
    id: 3,
    name: 'Ivory Zari Georgette',
    image: sareeImg,
    origin: 'Mysore Silk',
    price: 150000,
    span: 'medium'
  },
  {
    id: 4,
    name: 'Emerald Brocade',
    image: sareeImg,
    origin: 'Kanchipuram',
    price: 320000,
    span: 'medium'
  },
  {
    id: 5,
    name: 'Obsidian Gold Tissue',
    image: sareeImg,
    origin: 'Uppada Silk',
    price: 550000,
    span: 'wide'
  }
];

const SareePage = () => {
  const navigate = useNavigate();

  return (
    <div className="private-archive-container">

      {/* Profile Button */}
      <button
        className="archive-profile-btn"
        onClick={() => navigate('/profile')}
        title="Command Center"
      >
        <FaUser size={20} />
      </button>

      {/* Masterpiece Hero */}
      <section className="archive-hero">
        <div className="masterpiece-frame">
          <img src={masterpiece.image} alt={masterpiece.name} className="masterpiece-image" />
          <h1 className="masterpiece-title">{masterpiece.name}</h1>
        </div>
      </section>

      {/* Elite Filter Bar */}
      <div className="archive-filters">
        <div className="filter-group">
          <span className="filter-link active">Refine Collection</span>
          <span className="filter-link">Filter by Weave</span>
          <span className="filter-link">Sort by Era</span>
        </div>
        <div className="filter-group">
          <span className="filter-link">View Latest Manifestations</span>
        </div>
      </div>

      {/* Asymmetrical "Gallery" Grid */}
      <div className="archive-grid">
        {products.map(product => (
          <ArchiveCard key={product.id} product={product} span={product.span} />
        ))}
      </div>

    </div>
  );
};

export default SareePage;
