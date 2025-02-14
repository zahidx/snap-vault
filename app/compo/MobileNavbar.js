// app/compo/MobileNavbar.js
"use client";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNavbar({ toggleMenu, menuOpen, toggleDarkMode, darkMode }) {
  return (
    <div className="md:hidden max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold tracking-tight cursor-pointer"
      >
        PhotoGallery
      </motion.h1>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={toggleMenu}>
        <Menu size={28} />
      </button>

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
                "Search",
                "Categories",
                "Sign In",
                darkMode ? "Light Mode" : "Dark Mode",
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
    </div>
  );
}
