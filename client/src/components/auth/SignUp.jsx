import React, { useState } from 'react';

const SignUp = ({ onClose, onSwitchToSignIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up:', { name, email, password });
    alert('Sign Up functionality - connect to backend');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: 40,
        borderRadius: 12,
        maxWidth: 400,
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer'
          }}
        >×</button>
        <h2 style={{ marginBottom: 20, color: '#111F42' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 15,
              border: '1px solid #ddd',
              borderRadius: 6
            }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 15,
              border: '1px solid #ddd',
              borderRadius: 6
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 15,
              border: '1px solid #ddd',
              borderRadius: 6
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              background: '#111F42',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >Sign Up</button>
        </form>
        <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToSignIn}
            style={{ color: '#111F42', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
