import React, { useState, useRef } from 'react';
import { FaCamera, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ImageUpload = ({ currentImage, onUpload, isLoading, label = "Profile Picture" }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Prepare FormData and trigger upload immediately (or leave for parent to trigger)
            const formData = new FormData();
            formData.append('image', file);
            onUpload(formData);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Image Container */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid white',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        position: 'relative',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {(preview || currentImage) ? (
                        <img
                            src={preview || currentImage}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <FaUser size={50} color="#cbd5e1" />
                    )}

                    {/* Overlay on Hover */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    }} className="upload-overlay">
                        <FaCamera color="white" size={24} />
                    </div>
                </motion.div>

                {/* Edit Icon Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    background: '#FF7D40',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid white',
                    color: 'white',
                    boxShadow: '0 4px 10px rgba(255, 125, 64, 0.3)'
                }}>
                    {isLoading ? (
                        <div className="spinner" style={{
                            width: '14px', height: '14px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    ) : (
                        <FaCamera size={14} />
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </div>

            <style>{`
                .upload-overlay:hover { opacity: 1 !important; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                {label}
            </p>
        </div>
    );
};

export default ImageUpload;
