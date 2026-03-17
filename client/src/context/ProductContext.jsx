import React, { createContext, useState } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`https://e-commerce-2e5z.onrender.com/api/products?${queryString}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      const { data } = await axios.get(`https://e-commerce-2e5z.onrender.com/api/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, fetchProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
