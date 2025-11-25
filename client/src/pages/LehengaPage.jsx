import React from "react";
import lehenga1 from "../assets/products/lehenga1.jpg";
import lehenga2 from "../assets/products/lehenga2.jpg";
// Add more imports if you have other lehenga images
import "./LehengaPage.css";

const lehengaProducts = [
  {
    id: 1,
    name: "Floral Lehenga",
    description: "Hand-embroidered, elegant chiffon with floral motifs.",
    price: "₹2,899",
    image: lehenga1, // Use imported variable, not string
  },
  {
    id: 2,
    name: "Party Lehenga",
    description: "Sequinned georgette, luxurious festive design.",
    price: "₹3,299",
    image: lehenga2,
  },
  // Add more products if you have more images, using same style
];

function LehengaPage() {
  return (
    <main className="product-grid">
      <h2 className="category-title">Lehenga Collection</h2>
      <div className="products-wrap">
        {lehengaProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h4 className="product-title">{product.name}</h4>
            <p className="product-desc">{product.description}</p>
            <div className="product-price">{product.price}</div>
            <button className="wishlist-btn">&#9825;</button>
            <button className="cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default LehengaPage;
