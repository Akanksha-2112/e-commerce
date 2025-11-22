import React, { useEffect, useContext } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { ProductContext } from '../context/ProductContext';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get('subcategory');
  
  const { products, fetchProducts, loading } = useContext(ProductContext);

  useEffect(() => {
    const filters = { category: categoryName };
    if (subcategory) {
      filters.subcategory = subcategory;
    }
    fetchProducts(filters);
  }, [categoryName, subcategory]);

  return (
    <div className="category-page">
      <Navbar />
      
      <div className="category-header">
        <h1>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}'s Clothing</h1>
        {subcategory && <p>Showing: {subcategory.replace('-', ' ')}</p>}
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="products-container">
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                  <div className="product-image">
                    <img src={product.images[0]?.url || '/placeholder.jpg'} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">₹{product.price}</p>
                    <p className="description">{product.description.substring(0, 80)}...</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
