import React, { useState } from "react";
import {
  FaBars, FaTimes, FaChevronDown, FaChevronUp,
  FaRegUser, FaRegHeart, FaShoppingBag, FaSearch
} from "react-icons/fa";
import "./LandingPage.css";

const PRODUCT_DATA = {
  MEN: {
    Shirts: [
      {
        id: 1,
        name: "Classic White Shirt",
        description: "100% cotton, regular fit.",
        price: 899,
        image: "https://via.placeholder.com/200x120?text=White+Shirt",
      },
      {
        id: 2,
        name: "Checked Casual Shirt",
        description: "Cool checks, breathable fabric.",
        price: 749,
        image: "https://via.placeholder.com/200x120?text=Checked+Shirt",
      },
    ],
    Pants: [
      {
        id: 3,
        name: "Slim Fit Chinos",
        description: "Stretchable, olive green.",
        price: 1099,
        image: "https://via.placeholder.com/200x120?text=Chinos",
      },
      {
        id: 4,
        name: "Formal Trousers",
        description: "Suit-perfect, dark navy.",
        price: 1299,
        image: "https://via.placeholder.com/200x120?text=Trousers",
      },
    ],
    "T-Shirts": [
      {
        id: 5,
        name: "Sports Tee",
        description: "Moisture wicking, quick dry.",
        price: 499,
        image: "https://via.placeholder.com/200x120?text=Sports+Tee",
      },
      {
        id: 6,
        name: "Printed Tee",
        description: "Trendy print, soft feel.",
        price: 599,
        image: "https://via.placeholder.com/200x120?text=Printed+Tee",
      },
    ],
    Suits: [
      {
        id: 7,
        name: "2-piece Formal Suit",
        description: "Charcoal color, slim fit.",
        price: 2999,
        image: "https://via.placeholder.com/200x120?text=Formal+Suit",
      },
      {
        id: 8,
        name: "Wedding Suit",
        description: "Premium blend, best for occasions.",
        price: 3999,
        image: "https://via.placeholder.com/200x120?text=Wedding+Suit",
      },
    ],
  },
  WOMEN: {
    Lehenga: [
      {
        id: 9,
        name: "Floral Lehenga",
        description: "Hand-embroidered, chiffon.",
        price: 2899,
        image: "https://via.placeholder.com/200x120?text=Floral+Lehenga",
      },
      {
        id: 10,
        name: "Party Lehenga",
        description: "Sequinned design, luxurious style.",
        price: 3299,
        image: "https://via.placeholder.com/200x120?text=Party+Lehenga",
      },
    ],
    Dress: [
      {
        id: 11,
        name: "Red Evening Dress",
        description: "Elegant, classy evening wear.",
        price: 1699,
        image: "https://via.placeholder.com/200x120?text=Evening+Dress",
      },
      {
        id: 12,
        name: "Casual Day Dress",
        description: "Cotton material, summer style.",
        price: 1199,
        image: "https://via.placeholder.com/200x120?text=Day+Dress",
      },
    ],
    Frock: [
      {
        id: 13,
        name: "Polka Dot Frock",
        description: "Fun print, lightweight fabric.",
        price: 899,
        image: "https://via.placeholder.com/200x120?text=Polka+Frock",
      },
    ],
    Saree: [
      {
        id: 14,
        name: "Silk Saree",
        description: "Traditional, woven pattern.",
        price: 1399,
        image: "https://via.placeholder.com/200x120?text=Silk+Saree",
      },
      {
        id: 15,
        name: "Designer Saree",
        description: "Contemporary designer style.",
        price: 1599,
        image: "https://via.placeholder.com/200x120?text=Designer+Saree",
      },
    ],
    Tops: [
      {
        id: 16,
        name: "Crop Top",
        description: "Trendy crop style, summer fit.",
        price: 599,
        image: "https://via.placeholder.com/200x120?text=Crop+Top",
      },
      {
        id: 17,
        name: "Formal Blouse",
        description: "Perfect for office wear.",
        price: 699,
        image: "https://via.placeholder.com/200x120?text=Blouse",
      },
    ],
    Skirts: [
      {
        id: 18,
        name: "Denim Skirt",
        description: "Classic blue denim.",
        price: 999,
        image: "https://via.placeholder.com/200x120?text=Denim+Skirt",
      },
    ],
  },
  KIDS: {
    Boys: {
      "T-Shirts": [
        {
          id: 19,
          name: "Superhero T-shirt",
          description: "Marvel print, soft cotton.",
          price: 399,
          image: "https://via.placeholder.com/200x120?text=Superhero+Tshirt",
        },
      ],
      Shorts: [
        {
          id: 20,
          name: "Cargo Shorts",
          description: "Light, durable, play-perfect.",
          price: 349,
          image: "https://via.placeholder.com/200x120?text=Cargo+Shorts",
        },
      ],
    },
    Girls: {
      Frocks: [
        {
          id: 21,
          name: "Princess Frock",
          description: "Cute design, comfortable material.",
          price: 499,
          image: "https://via.placeholder.com/200x120?text=Princess+Frock",
        },
      ],
      Dresses: [
        {
          id: 22,
          name: "Summer Dress",
          description: "Light colors, top style.",
          price: 599,
          image: "https://via.placeholder.com/200x120?text=Summer+Dress",
        },
      ],
    },
  },
};

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(""); // "MEN" | "WOMEN" | "KIDS"
  const [kidsSub, setKidsSub] = useState(""); // "Boys" | "Girls"
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handles click for MEN and WOMEN subcategories
  const handleSubClick = (category, subcat) => {
    setSelectedProducts(PRODUCT_DATA[category][subcat] || []);
    setMenuOpen(false);
    setExpanded("");
    setKidsSub("");
  };
  // Handles click for KIDS subcategories
  const handleKidsSubClick = (gender, subcat) => {
    setSelectedProducts(PRODUCT_DATA.KIDS[gender][subcat] || []);
    setMenuOpen(false);
    setExpanded("");
    setKidsSub("");
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="navbar">
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={28} />
        </button>
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
        </div>
        <div className="navbar-right">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more"
            />
          </div>
          <a href="/profile" className="icon-box">
            <FaRegUser className="navbar-icon" />
            <span>Profile</span>
          </a>
          <a href="/wishlist" className="icon-box">
            <FaRegHeart className="navbar-icon" />
            <span>Wishlist</span>
          </a>
          <a href="/cart" className="icon-box">
            <FaShoppingBag className="navbar-icon" />
            <span>Bag</span>
          </a>
        </div>
      </header>
      {/* Hamburger Slide-out Menu */}
      {menuOpen && (
        <>
          <nav className="side-menu">
            <button
              className="close-menu-btn"
              onClick={() => {
                setMenuOpen(false);
                setExpanded("");
                setKidsSub("");
              }}
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
            <ul className="side-menu-list">
              <li>
                <button
                  className="side-menu-category"
                  onClick={() => setExpanded(expanded === "MEN" ? "" : "MEN")}
                >
                  MEN {expanded === "MEN" ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expanded === "MEN" && (
                  <ul className="side-menu-sub">
                    {Object.keys(PRODUCT_DATA.MEN).map(sub => (
                      <li key={sub}>
                        <button
                          className="menu-link"
                          onClick={() => handleSubClick("MEN", sub)}
                        >{sub}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <button
                  className="side-menu-category"
                  onClick={() => setExpanded(expanded === "WOMEN" ? "" : "WOMEN")}
                >
                  WOMEN {expanded === "WOMEN" ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expanded === "WOMEN" && (
                  <ul className="side-menu-sub">
                    {Object.keys(PRODUCT_DATA.WOMEN).map(sub => (
                      <li key={sub}>
                        <button
                          className="menu-link"
                          onClick={() => handleSubClick("WOMEN", sub)}
                        >{sub}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <button
                  className="side-menu-category"
                  onClick={() => setExpanded(expanded === "KIDS" ? "" : "KIDS")}
                >
                  KIDS {expanded === "KIDS" ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expanded === "KIDS" && (
                  <ul className="side-menu-sub">
                    <li>
                      <button
                        className="side-menu-category"
                        onClick={() => setKidsSub(kidsSub === "Boys" ? "" : "Boys")}
                      >
                        Boys {kidsSub === "Boys" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      {kidsSub === "Boys" && (
                        <ul className="side-menu-sub">
                          {Object.keys(PRODUCT_DATA.KIDS.Boys).map(sub =>
                            <li key={sub}>
                              <button
                                className="menu-link"
                                onClick={() => handleKidsSubClick("Boys", sub)}
                              >{sub}</button>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                    <li>
                      <button
                        className="side-menu-category"
                        onClick={() => setKidsSub(kidsSub === "Girls" ? "" : "Girls")}
                      >
                        Girls {kidsSub === "Girls" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      {kidsSub === "Girls" && (
                        <ul className="side-menu-sub">
                          {Object.keys(PRODUCT_DATA.KIDS.Girls).map(sub =>
                            <li key={sub}>
                              <button
                                className="menu-link"
                                onClick={() => handleKidsSubClick("Girls", sub)}
                              >{sub}</button>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
        </>
      )}
      {/* Product grid: display when subcategory selected */}
      {selectedProducts.length > 0 && (
        <section className="product-grid">
          <div className="products-wrap">
            {selectedProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h4 className="product-title">{product.name}</h4>
                <p className="product-desc">{product.description}</p>
                <div className="product-price">₹{product.price}</div>
                <button className="wishlist-btn">&#9825;</button>
                <button className="cart-btn">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Hero Section: shows when no products selected */}
      {selectedProducts.length === 0 && (
        <main className="hero-section">
          <div className="hero-inner">
            <h1 className="hero-title">Elevate Your Style</h1>
            <p className="hero-desc">
              Discover the new era of fashion with exquisite ethnic and contemporary collections, designed for those who demand luxury and authenticity.
            </p>
            <a href="/catalogue" className="catalogue-btn">View Catalogue</a>
          </div>
        </main>
      )}
    </>
  );
}

export default LandingPage;
