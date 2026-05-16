import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { useGlobal } from '../context/GlobalContext';
import Navbar from '../components/Navbar';
import { API_BASE } from '../config';
import '../styles/CollectionShowcase.css';

const SUBCATEGORY_FALLBACKS = {
    Sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80',
    Lehengas: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700&q=80',
    Dresses: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=700&q=80',
    Tops: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=700&q=80',
    Kurtis: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=700&q=80',
    Shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=80',
    Pants: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    Jackets: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    Suits: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80',
    'Girls Lehengas': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Girls Shararas': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Girls Gowns': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80',
    'Boys Kurtas': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    'Boys Sherwanis': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    'Boys Suits': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&q=80',
    default: 'https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=700&q=80',
};

const getFallback = (sub) => SUBCATEGORY_FALLBACKS[sub || 'default'] || SUBCATEGORY_FALLBACKS.default;

const generateMockProducts = (category, subcategory) => (
    Array.from({ length: 8 }).map((_, i) => ({
        _id: `mock-${category}-${subcategory}-${i}`,
        name: `${subcategory} Edition ${i + 1}`,
        brand: 'AWIK MAISON',
        price: 4500 + i * 900,
        images: [{ url: getFallback(subcategory) }],
    }))
);

const formatPrice = p => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
}).format(p);

const CategoryProducts = ({ category }) => {
    const { subcategory } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useGlobal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_BASE}/api/products?category=${category}&subcategory=${subcategory}`);
                setProducts(data.products?.length ? data.products : generateMockProducts(category, subcategory));
            } catch {
                setProducts(generateMockProducts(category, subcategory));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subcategory]);

    const getImg = (product) => {
        const url = product.images?.[0]?.url;
        if (url && !url.includes('placeholder') && !url.includes('placehold')) return url;
        return getFallback(subcategory);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: getImg(product),
            quantity: 1
        });
    };

    return (
        <div className="collection-page">
            <Navbar />

            <header className="collection-hero collection-hero--compact">
                <div className="collection-kicker">{category}</div>
                <h1>{subcategory}</h1>
                <p>
                    Discover the latest pieces in this edit, from atelier staples to festive statements.
                </p>
                <button className="collection-back" onClick={() => navigate(`/${category.toLowerCase()}`)}>
                    <FaArrowLeft />
                    <span>Back to {category}</span>
                </button>
            </header>

            {loading ? (
                <div className="collection-loading">Loading collection</div>
            ) : (
                <section className="collection-grid" aria-label={`${subcategory} products`}>
                    {products.map((product, index) => (
                        <motion.article
                            key={product._id}
                            className="collection-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: index * 0.045, ease: 'easeOut' }}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <div className="collection-card-media">
                                <img
                                    src={getImg(product)}
                                    alt={product.name}
                                    onError={e => { e.target.onerror = null; e.target.src = getFallback(subcategory); }}
                                />
                                <span className="collection-card-badge">New</span>
                                <div className="collection-card-actions">
                                    <button type="button" onClick={e => handleAddToCart(e, product)} aria-label={`Add ${product.name} to bag`}>
                                        <FaShoppingBag />
                                        <span>Add to Bag</span>
                                    </button>
                                </div>
                            </div>

                            <div className="collection-card-body">
                                <span>{product.brand || 'AWIK MAISON'}</span>
                                <h2>{product.name}</h2>
                                <div className="collection-card-footer">
                                    <p>{formatPrice(product.price)}</p>
                                    <FaArrowRight aria-hidden="true" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </section>
            )}
        </div>
    );
};

export default CategoryProducts;
