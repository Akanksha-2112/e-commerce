import React, { useEffect } from 'react';
import '../styles/CurtainIntro.css';

const CurtainIntro = ({ onComplete }) => {
  useEffect(() => {
    // Automatically complete after curtain animation (2 seconds)
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="curtain-intro">
      <div className="curtain curtain-left"></div>
      <div className="curtain curtain-right"></div>
      <div className="curtain-text">AWIK Fashion</div>
    </div>
  );
};

export default CurtainIntro;
