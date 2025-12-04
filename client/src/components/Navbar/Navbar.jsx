// src/components/Navbar/Navbar.jsx
import React, { useState, useContext } from "react";
import "./Navbar.css";
import logo from "../../assets/logo_muhafiz.png";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // get a display name fallback
  const displayText = user ? (user.username || user.name || user.email || "") : "";
  const initial = displayText ? displayText.charAt(0).toUpperCase() : "";

  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} alt="Muhafiz" />
        <span><b>Kviz</b>room</span>
      </div>

      <div className="right-section">
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </button>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
          <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
          <li><Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>

          {user ? (
            <li>
              <div className="avatar-container" onClick={logout} title={displayText}>
                { (user.photo || user.avatar) ? (
                  <img
                    src={user.photo || user.avatar}
                    alt="Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-circle">
                    {initial}
                  </div>
                )}
              </div>
            </li>
          ) : (
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
