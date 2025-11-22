import React, { useState } from 'react';

// Import kanjeevaram fabrics
import kanjeevaram1 from '../assets/fabrics/kanjeevaram/kanjeevaram1.png';
import kanjeevaram2 from '../assets/fabrics/kanjeevaram/kanjeevaram2.png';
import kanjeevaram3 from '../assets/fabrics/kanjeevaram/kanjeevaram3.png';

// Import organza fabrics
import organza1 from '../assets/fabrics/organza/organza1.png';
import organza2 from '../assets/fabrics/organza/organza2.png';
import organza3 from '../assets/fabrics/organza/organza3.png';

// Fabric data with your images
const fabricsData = [
  {
    id: 1,
    name: 'Kanjeevaram Silk Red',
    category: 'Traditional',
    image: kanjeevaram1,
    color: '#C41E3A',
    description: 'Premium silk with golden zari work'
  },
  {
    id: 2,
    name: 'Kanjeevaram Gold',
    category: 'Traditional',
    image: kanjeevaram2,
    color: '#FFD700',
    description: 'Classic gold with temple border'
  },
  {
    id: 3,
    name: 'Kanjeevaram Royal',
    category: 'Traditional',
    image: kanjeevaram3,
    color: '#800020',
    description: 'Royal Kanjeevaram with intricate patterns'
  },
  {
    id: 4,
    name: 'Organza Pink',
    category: 'Modern',
    image: organza1,
    color: '#FFB6C1',
    description: 'Light and flowy organza fabric'
  },
  {
    id: 5,
    name: 'Organza Blue',
    category: 'Modern',
    image: organza2,
    color: '#4169E1',
    description: 'Elegant blue organza'
  },
  {
    id: 6,
    name: 'Organza Lavender',
    category: 'Modern',
    image: organza3,
    color: '#E6E6FA',
    description: 'Delicate lavender organza'
  },
];

const FabricGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Traditional', 'Modern'];

  const filteredFabrics = selectedCategory === 'All' 
    ? fabricsData 
    : fabricsData.filter(f => f.category === selectedCategory);

  const handleDragStart = (e, fabric) => {
    e.dataTransfer.setData('fabric', JSON.stringify(fabric));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={styles.fabricGallery}>
      <h3 style={styles.galleryTitle}>Fabric Collection</h3>
      
      {/* Category Filter */}
      <div style={styles.categoryFilter}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === cat ? styles.filterBtnActive : {})
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Fabric Grid */}
      <div style={styles.fabricsGrid}>
        {filteredFabrics.map(fabric => (
          <div
            key={fabric.id}
            style={styles.fabricCard}
            draggable
            onDragStart={(e) => handleDragStart(e, fabric)}
          >
            <div style={styles.fabricImageContainer}>
              <img src={fabric.image} alt={fabric.name} style={styles.fabricImage} />
              <div style={styles.dragIndicator}>
                <span>⋮⋮</span>
              </div>
            </div>
            <div style={styles.fabricInfo}>
              <h4 style={styles.fabricName}>{fabric.name}</h4>
              <p style={styles.fabricCategory}>{fabric.category}</p>
              <p style={styles.fabricDescription}>{fabric.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  fabricGallery: {
    width: '100%',
    height: '100%',
  },
  galleryTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1.4rem',
    marginBottom: '20px',
    color: '#fff',
    letterSpacing: '1px',
    textAlign: 'center',
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    flex: 1,
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderColor: 'transparent',
  },
  fabricsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  fabricCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'grab',
    transition: 'all 0.3s',
  },
  fabricImageContainer: {
    position: 'relative',
    width: '100%',
    height: '120px',
    overflow: 'hidden',
  },
  fabricImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  dragIndicator: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '1.2rem',
  },
  fabricInfo: {
    padding: '12px',
  },
  fabricName: {
    fontSize: '1rem',
    marginBottom: '5px',
    color: '#fff',
    fontWeight: 500,
    margin: '0 0 5px 0',
  },
  fabricCategory: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '6px',
    margin: '0 0 6px 0',
  },
  fabricDescription: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.4',
    margin: 0,
  },
};

export default FabricGallery;
