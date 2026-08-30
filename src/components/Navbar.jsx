import { useState } from "react"

function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        Owanana's Kitchen
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#catering" onClick={closeMenu}>Catering</a>
        <a href="#menu" onClick={closeMenu}>Menu</a>
        <a href="#packages" onClick={closeMenu}>Food Packages</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </div>

      <button className="navbar-cart" onClick={onCartClick}>
        Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      <button
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}

export default Navbar