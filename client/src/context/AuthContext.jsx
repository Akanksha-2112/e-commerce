import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Check for tokens in URL (OAuth redirect)
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userStr = params.get('user');

      if (token) {
        try {
          let userData;
          if (userStr) {
            // Case A: User data passed via URL
            const parsedUser = JSON.parse(decodeURIComponent(userStr));
            userData = { ...parsedUser, token };
          } else {
            // Case B: Only token passed, fetch user profile
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
            userData = { ...data, token };
          }

          setUser(userData);
          localStorage.setItem('userInfo', JSON.stringify(userData));

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // Redirect to Command Center
          navigate('/sarees');
        } catch (error) {
          console.error('Error parsing user data from URL', error);
        }
      } else {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      }
      setLoading(false);
    };

    handleAuth();
  }, [navigate]);

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password }, config);

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/sarees');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);

      if (data.otpSent) {
        // Case A: 2FA Required
        return { success: true, type: 'otp', message: data.message };
      } else if (data.token) {
        // Case B: Immediate Login (2FA Disabled)
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return { success: true, type: 'token', user: data };
      }

      return { success: false, message: 'Unexpected response from server' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp }, config);

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/sarees');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Invalid Code' };
    }
  };

  const uploadProfilePicture = async (formData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('http://localhost:5000/api/auth/upload-profile-picture', formData, config);

      const updatedUser = { ...user, profilePicture: data.profilePicture };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser)); // Update local storage
      return { success: true, data: data.profilePicture };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upload failed' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put('http://localhost:5000/api/auth/change-password', { currentPassword, newPassword }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Password change failed' };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const config = {
        data: { password }, // DELETE requests send body in 'data' field
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete('http://localhost:5000/api/auth/delete-account', config);
      logout(); // Log out after deletion
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Account deletion failed' };
    }
  };

  const getUserStats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get('http://localhost:5000/api/auth/stats', config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch stats' };
    }
  };

  const verifyEmail = async (token) => {
    // Logic to call verify endpoint usually happens on a specific page, but keeping a helper here is good
    try {
      const { data } = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.post('http://localhost:5000/api/auth/send-verification', {}, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send verification email' };
    }
  };

  const getWishlist = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/auth/wishlist', config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error fetching wishlist' };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/auth/wishlist', { productId }, config);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error adding to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/auth/wishlist/${productId}`, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error removing from wishlist' };
    }
  };

  const getRecentlyViewed = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/auth/recently-viewed', config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error fetching recently viewed' };
    }
  };

  const addToRecentlyViewed = async (productId) => {
    if (!user) return; // Only if logged in
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/auth/recently-viewed', { productId }, config);
    } catch (err) {
      // Silent fail for recently viewed
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      uploadProfilePicture,
      changePassword,
      deleteAccount,
      getUserStats,
      verifyEmail,
      sendVerificationEmail,
      getWishlist,
      addToWishlist,
      removeFromWishlist,
      getRecentlyViewed,
      getRecentlyViewed,
      addToRecentlyViewed,
      verifyOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
