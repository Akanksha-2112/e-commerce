import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FabricGallery from '../components/FabricGallery';
import '../styles/DesignStudio.css';

const DesignStudio = () => {
  const { outfit } = useParams();
  const navigate = useNavigate();
  const [appliedFabrics, setAppliedFabrics] = useState({
    choli: null,
    skirt: null,
    dupatta: null
  });

  const handleDrop = (e, zone) => {
    e.preventDefault();
    const fabricData = JSON.parse(e.dataTransfer.getData('fabric'));
    setAppliedFabrics(prev => ({
      ...prev,
      [zone]: fabricData
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setAppliedFabrics({
      choli: null,
      skirt: null,
      dupatta: null
    });
  };

  const handleSave = () => {
    console.log('Saving design:', appliedFabrics);
    alert('Design saved successfully!');
  };

  // Go back to previous page instead of home
  const handleBack = () => {
    navigate(-1);  // This goes back one step in history
  };

  return (
    <div className="design-studio-container">
      <button onClick={handleBack} className="back-btn">
        ← Back
      </button>

      <div className="studio-workspace">
        {/* LEFT SIDE - Fabric Selector */}
        <div className="fabric-panel">
          <FabricGallery />
        </div>

        {/* RIGHT SIDE - Mannequin and Info */}
        <div className="right-panel">
          {/* Mannequin Canvas */}
          <div className="mannequin-panel">
            <h2>Design Your {outfit || 'Lehenga'}</h2>
            <p className="instruction-text">Drag fabrics onto the mannequin zones</p>
            
            <svg 
              width="100%" 
              height="650" 
              viewBox="0 0 450 650" 
              className="mannequin-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Fabric Patterns with Images */}
                {appliedFabrics.choli && (
                  <pattern id="choliPattern" x="0" y="0" width="450" height="650" patternUnits="userSpaceOnUse">
                    <image 
                      href={appliedFabrics.choli.image} 
                      width="450" 
                      height="650" 
                      preserveAspectRatio="xMidYMid slice" 
                    />
                  </pattern>
                )}
                
                {appliedFabrics.skirt && (
                  <pattern id="skirtPattern" x="0" y="0" width="450" height="650" patternUnits="userSpaceOnUse">
                    <image 
                      href={appliedFabrics.skirt.image} 
                      width="450" 
                      height="650" 
                      preserveAspectRatio="xMidYMid slice" 
                    />
                  </pattern>
                )}
                
                {appliedFabrics.dupatta && (
                  <pattern id="dupattaPattern" x="0" y="0" width="450" height="650" patternUnits="userSpaceOnUse">
                    <image 
                      href={appliedFabrics.dupatta.image} 
                      width="450" 
                      height="650" 
                      preserveAspectRatio="xMidYMid slice" 
                    />
                  </pattern>
                )}

                {/* Clip Paths - Pre-designed Lehenga Shape */}
                <clipPath id="choliClip">
                  <path d="M 180 120 L 270 120 Q 280 140 280 160 L 280 200 Q 225 220 170 200 L 170 160 Q 170 140 180 120 Z" />
                </clipPath>
                
                <clipPath id="skirtClip">
                  <path d="M 165 210 L 285 210 L 320 580 Q 225 600 130 580 Z" />
                </clipPath>
                
                <clipPath id="dupattaClip">
                  <path d="M 120 100 L 160 100 Q 170 300 175 500 L 140 490 Q 130 300 120 100 Z" />
                </clipPath>
              </defs>

              {/* Background */}
              <rect width="450" height="650" fill="#0a0a0a" />

              {/* Dupatta Zone */}
              <g 
                onDrop={(e) => handleDrop(e, 'dupatta')}
                onDragOver={handleDragOver}
                className="drop-zone"
              >
                <path
                  d="M 120 100 L 160 100 Q 170 300 175 500 L 140 490 Q 130 300 120 100 Z"
                  fill={appliedFabrics.dupatta ? "url(#dupattaPattern)" : "rgba(100, 100, 100, 0.15)"}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  clipPath="url(#dupattaClip)"
                />
                {!appliedFabrics.dupatta && (
                  <text x="145" y="300" fontSize="14" fill="#888" textAnchor="middle" transform="rotate(-10 145 300)">
                    Dupatta
                  </text>
                )}
              </g>

              {/* Choli/Blouse Zone */}
              <g 
                onDrop={(e) => handleDrop(e, 'choli')}
                onDragOver={handleDragOver}
                className="drop-zone"
              >
                <path
                  d="M 180 120 L 270 120 Q 280 140 280 160 L 280 200 Q 225 220 170 200 L 170 160 Q 170 140 180 120 Z"
                  fill={appliedFabrics.choli ? "url(#choliPattern)" : "rgba(100, 100, 100, 0.15)"}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  clipPath="url(#choliClip)"
                />
                {!appliedFabrics.choli && (
                  <text x="225" y="165" fontSize="14" fill="#888" textAnchor="middle">
                    Choli
                  </text>
                )}
              </g>

              {/* Skirt/Lehenga Zone */}
              <g 
                onDrop={(e) => handleDrop(e, 'skirt')}
                onDragOver={handleDragOver}
                className="drop-zone"
              >
                <path
                  d="M 165 210 L 285 210 L 320 580 Q 225 600 130 580 Z"
                  fill={appliedFabrics.skirt ? "url(#skirtPattern)" : "rgba(100, 100, 100, 0.15)"}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  clipPath="url(#skirtClip)"
                />
                {!appliedFabrics.skirt && (
                  <text x="225" y="400" fontSize="14" fill="#888" textAnchor="middle">
                    Skirt
                  </text>
                )}
              </g>

              {/* Mannequin Outline */}
              <g opacity="0.2" stroke="#fff" strokeWidth="1" fill="none">
                <ellipse cx="225" cy="95" rx="25" ry="30" />
                <line x1="200" y1="120" x2="180" y2="120" />
                <line x1="250" y1="120" x2="270" y2="120" />
              </g>
            </svg>

            <div className="design-actions">
              <button onClick={handleReset} className="reset-btn">
                Reset Design
              </button>
              <button onClick={handleSave} className="save-btn">
                Save Design
              </button>
            </div>
          </div>

          {/* Applied Fabrics Info */}
          <div className="info-panel">
            <h3>Your Selection</h3>
            <div className="selected-fabrics">
              {Object.entries(appliedFabrics).map(([zone, fabric]) => (
                <div key={zone} className="fabric-item">
                  <strong>{zone.charAt(0).toUpperCase() + zone.slice(1)}:</strong>
                  <span>{fabric ? fabric.name : 'Not selected'}</span>
                  {fabric && (
                    <div className="fabric-preview-container">
                      <img 
                        src={fabric.image} 
                        alt={fabric.name}
                        className="fabric-preview-image" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Design Summary */}
            {(appliedFabrics.choli || appliedFabrics.skirt || appliedFabrics.dupatta) && (
              <div className="design-summary">
                <h4>Design Summary</h4>
                <p>Complete your design by filling all zones</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${(Object.values(appliedFabrics).filter(f => f !== null).length / 3) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="progress-text">
                  {Object.values(appliedFabrics).filter(f => f !== null).length} of 3 zones filled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
