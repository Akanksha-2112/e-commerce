import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState('');

  useEffect(() => {
    const exchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        setError('Invalid login attempt. No code found.');
        return;
      }

      try {
        const { data } = await axios.post(
          'https://e-commerce-2e5z.onrender.com/api/auth/oauth/exchange',
          { code }
        );

        if (data.success) {
          const userData = { ...data.user, token: data.token };
          // Store in localStorage and update context
          localStorage.setItem('userInfo', JSON.stringify(userData));
          setUser(userData);
          navigate('/sarees', { replace: true });
        } else {
          setError('Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('OAuth exchange error:', err);
        setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      }
    };

    exchangeCode();
  }, [navigate, setUser]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e5e5e5',
        fontFamily: 'Inter, sans-serif',
        gap: '20px'
      }}>
        <div style={{
          padding: '20px 30px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '4px',
          color: '#ef4444',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '12px 30px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: '700'
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#e5e5e5',
      fontFamily: 'Inter, sans-serif',
      gap: '20px'
    }}>
      {/* Animated spinner */}
      <div style={{
        width: '40px',
        height: '40px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderTop: '1px solid rgba(255,255,255,0.8)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#666'
      }}>
        Verifying Identity...
      </div>
    </div>
  );
};

export default OAuthCallback;
