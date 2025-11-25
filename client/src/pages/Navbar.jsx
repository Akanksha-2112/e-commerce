export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <header className="navbar">
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <FaBars size={28} />
        </button>
        <div className="navbar-left">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
        </div>
        <nav className="navbar-center">
          <a href="/men" className="navbar-link">MEN</a>
          <a href="/women" className="navbar-link">WOMEN</a>
          <a href="/kids" className="navbar-link">KIDS</a>
          <a href="/home" className="navbar-link">HOME</a>
          <a href="/beauty" className="navbar-link">BEAUTY</a>
          <a href="/genz" className="navbar-link">GENZ</a>
          <a href="/studio" className="navbar-link">STUDIO <span className="new-label">NEW</span></a>
        </nav>
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

      {/* Optional: Side Menu (you can style this as needed) */}
      {menuOpen && (
        <div className="side-menu">
          <a href="/men" className="menu-link">MEN</a>
          <a href="/women" className="menu-link">WOMEN</a>
          <a href="/kids" className="menu-link">KIDS</a>
          <a href="/home" className="menu-link">HOME</a>
          <a href="/beauty" className="menu-link">BEAUTY</a>
          <a href="/genz" className="menu-link">GENZ</a>
          <a href="/studio" className="menu-link">STUDIO</a>
        </div>
      )}

      {/* Hero Section (as before) */}
      <main className="hero-section">
        <div className="hero-inner">
          <h1 className="hero-title">Elevate Your Style</h1>
          <p className="hero-desc">
            Discover the new era of fashion with exquisite ethnic and contemporary collections, designed for those who demand luxury and authenticity.
          </p>
          <a href="/catalogue" className="catalogue-btn">View Catalogue</a>
        </div>
      </main>
    </>
  );
}
