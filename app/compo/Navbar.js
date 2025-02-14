// app/compo/Navbar.js
"use client";
import { useState, useRef, useEffect } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoryRef = useRef(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-lg bg-opacity-80 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900 shadow-lg"
      }`}
    >
      {/* Desktop Navbar */}
      <DesktopNavbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        categoriesOpen={categoriesOpen}
        toggleCategories={toggleCategories}
        categoryRef={categoryRef}
      />

      {/* Mobile Navbar */}
      <MobileNavbar
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
    </nav>
  );
}
