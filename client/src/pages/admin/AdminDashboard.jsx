import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_BASE } from '../../config';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        category: '',
        images: [{ url: '' }]
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            // navigate('/'); // Uncomment to enforce protection
        }
        fetchCategories();
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/categories`);
            console.log("Categories fetched:", data);
            setCategories(data.categories || data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: [{ url: e.target.value }] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (Number(formData.price) <= 0) {
            setError('Price must be greater than 0');
            return;
        }
        if (Number(formData.stock) < 0) {
            setError('Stock cannot be negative');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const payload = {
                ...formData,
                category: formData.category, // ObjectId
            };

            await axios.post(`${API_BASE}/api/products`, payload, config);
            setMessage('Product created successfully');
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                sku: '',
                category: '',
                images: [{ url: '' }]
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating product');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE}/api/categories`, { name: newCategory }, config);
            setNewCategory('');
            fetchCategories(); // Refresh list
            setMessage('Category added');
        } catch (err) {
            setError('Error adding category');
        }
    };

    const [newCategory, setNewCategory] = useState('');

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '100px auto', fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '20px' }}>Admin Dashboard</h1>

            <div style={{ background: '#FAF9F6', padding: '30px', border: '1px solid #eee' }}>
                <h2 style={{ marginBottom: '20px' }}>Add New Product</h2>
                {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                {/* Quick Add Category */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #ccc' }}>
                    <h3>Quick Add Category</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Category Name (e.g., Handbags)"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={{ flex: 1, padding: '10px' }}
                        />
                        <button onClick={handleCreateCategory} style={{ padding: '10px', background: '#333', color: '#fff', border: 'none' }}>Add</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Product Title</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            required
                        />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                                required
                            />
                        </div>
                        <div>
                            <label>Inventory Count</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label>SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            required
                        />
                    </div>

                    <div>
                        <label>High-Res Image URL</label>
                        <input
                            type="text"
                            value={formData.images[0].url}
                            onChange={handleImageChange}
                            placeholder="https://..."
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: '#1A1A1A',
                            color: '#fff',
                            padding: '15px',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
