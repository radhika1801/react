import React from "react";
import { NavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import "/src/components/Navbar.css"; 

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* Left Brand */}
      <div className="nav-left">
        <NavLink to="/" className="brand">
          east river — fragments
        </NavLink>
      </div>

      {/* Center Links */}
      <ul className="nav-links">
        <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
        <li><NavLink to="/research" className={linkClass}>Research</NavLink></li>
        <li><NavLink to="/gallery" className={linkClass}>Gallery</NavLink></li>
        <li><NavLink to="/map" className={linkClass}>Map</NavLink></li>
        <li><NavLink to="/structure3D" className={linkClass}>Structure</NavLink></li>
      </ul>

      {/* Right CTA */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="nav-cta"
      >
        <ScrollLink
          to="contact"
          smooth={true}
          duration={600}
          offset={-70}
          className="cta-link"
        >
      
        </ScrollLink>
      </motion.div>
    </nav>
  );
}
