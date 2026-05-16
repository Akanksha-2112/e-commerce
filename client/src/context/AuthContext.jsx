import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_BASE } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo && userInfo !== 'undefined') {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setLoading(false); // unblock UI immediately with cached user data

          // Background refresh to get latest data and validate token
          try {
            const config = { headers: { Authorization: `Bearer ${parsedUser.token}` } };
            const { data } = await axios.get(`${API_BASE}/api/auth/profile`, config);
            const updatedData = { ...data, token: parsedUser.token };
            setUser(updatedData);
            localStorage.setItem('userInfo', JSON.stringify(updatedData));
          } catch (error) {
            console.error('Token invalid or expired', error);
            // Silent fail — let user continue with cached data or re-login manually
          }
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error('Error parsing user info', e);
        localStorage.removeItem('userInfo');
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (firstName, lastName, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, { firstName, lastName, email, password }, config);

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || (error.message === 'Network Error' ? 'Network Error: Cannot reach server.' : 'Registration failed');
      return { success: false, message: msg };
    }
  };

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, config);

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
      const msg = error.response?.data?.message || (error.message === 'Network Error' ? 'Network Error: Cannot reach server.' : 'Login failed');
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_BASE}/api/auth/verify-otp`, { email, otp }, config);

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
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
      const { data } = await axios.post(`${API_BASE}/api/auth/upload-profile-picture`, formData, config);

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
      await axios.put(`${API_BASE}/api/auth/change-password`, { currentPassword, newPassword }, config);
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
      await axios.delete(`${API_BASE}/api/auth/delete-account`, config);
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
      const { data } = await axios.get(`${API_BASE}/api/auth/stats`, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch stats' };
    }
  };

  const verifyEmail = async (token) => {
    // Logic to call verify endpoint usually happens on a specific page, but keeping a helper here is good
    try {
      const { data } = await axios.get(`${API_BASE}/api/auth/verify-email/${token}`);
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
      await axios.post(`${API_BASE}/api/auth/send-verification`, {}, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send verification email' };
    }
  };

  const getWishlist = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_BASE}/api/auth/wishlist`, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error fetching wishlist' };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_BASE}/api/auth/wishlist`, { productId }, config);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error adding to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_BASE}/api/auth/wishlist/${productId}`, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error removing from wishlist' };
    }
  };

  const getRecentlyViewed = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_BASE}/api/auth/recently-viewed`, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error fetching recently viewed' };
    }
  };

  const addToRecentlyViewed = async (productId) => {
    if (!user) return; // Only if logged in
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_BASE}/api/auth/recently-viewed`, { productId }, config);
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
      setUser,
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
      addToRecentlyViewed,
      verifyOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
