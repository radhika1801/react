import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import "/src/components/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* Left Brand */}
      <div className="nav-left">
        <NavLink to="/" className="brand">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="brand-content"
          >
            <span className="brand-text">east river — fragments</span>
          </motion.div>
        </NavLink>
      </div>

      {/* Center Navigation */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={linkClass}>
            <svg className="link-icon" width="14" height="14" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="3" ry="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/research" className={linkClass}>
            <svg className="link-icon" width="14" height="14" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="2.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(30 8 8)" />
            </svg>
            <span>Research</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery" className={linkClass}>
            <svg className="link-icon" width="14" height="14" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="3" ry="6" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 8 8)" />
            </svg>
            <span>Interactive Archive</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" className={linkClass}>
            <svg className="link-icon" width="14" height="14" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="2.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-45 8 8)" />
            </svg>
            <span>Info</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/structure" className={linkClass}>
            <svg className="link-icon" width="14" height="14" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="3" ry="6" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-75 8 8)" />
            </svg>
            <span>Data Awareness Room</span>
          </NavLink>
        </li>
      </ul>

      {/* Right Section */}
      <div className="nav-right">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="explore-btn"
        >
          <ScrollLink
            to="contact"
            smooth={true}
            duration={600}
            offset={-70}
            className="explore-link"
          >
            <svg className="explore-icon" width="16" height="16" viewBox="0 0 16 16">
              <ellipse cx="8" cy="8" rx="3" ry="6" fill="currentColor" transform="rotate(25 8 8)" />
            </svg>
          </ScrollLink>
        </motion.div>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mobile-menu"
        >
          <NavLink to="/" end className={linkClass} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/research" className={linkClass} onClick={() => setIsOpen(false)}>
            Research
          </NavLink>
          <NavLink to="/gallery" className={linkClass} onClick={() => setIsOpen(false)}>
            Interactive Archive
          </NavLink>
          <NavLink to="/map" className={linkClass} onClick={() => setIsOpen(false)}>
            Info
          </NavLink>
          <NavLink to="/structure" className={linkClass} onClick={() => setIsOpen(false)}>
            Data Awareness Room
          </NavLink>
        </motion.div>
      )}
    </nav>
  );
}