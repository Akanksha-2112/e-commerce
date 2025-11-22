import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const { user } = useContext(AuthContext);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const addToCart = async (productId, quantity, size, color) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/cart',
        { productId, quantity, size, color },
        config
      );
      setCart(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity },
        config
      );
      setCart(data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/cart/${itemId}`, config);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart', config);
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
