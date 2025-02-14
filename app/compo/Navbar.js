"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, User, Search, ChevronDown } from "lucide-react";

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
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg bg-opacity-80 transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900 shadow-lg"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-tight cursor-pointer"
        >
          PhotoGallery
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          className="hidden md:flex items-center bg-white dark:bg-gray-800 border rounded-xl px-3 py-2 w-80 shadow-md transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search images..."
            className="w-full bg-transparent outline-none text-sm dark:text-white"
          />
        </motion.div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Categories Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={toggleCategories}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <span>Categories</span>
              <ChevronDown size={18} />
            </button>
            <AnimatePresence>
              {categoriesOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border rounded-lg shadow-lg overflow-hidden"
                >
                  {["Nature", "Architecture", "Technology", "People", "Food"].map((category, index) => (
                    <motion.li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Profile / Login */}
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <User size={18} />
            <span>Sign In</span>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-gray-900 bg-opacity-95 text-white flex flex-col items-center justify-center space-y-6 z-50"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white text-3xl"
            >
              <X size={32} />
            </button>
            <motion.ul className="space-y-6 text-lg">
              {[
                "Search", "Categories", "Sign In", darkMode ? "Light Mode" : "Dark Mode",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer transition-all"
                  onClick={index === 3 ? toggleDarkMode : null}
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
