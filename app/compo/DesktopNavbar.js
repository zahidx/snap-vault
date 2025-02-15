"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Sun, Moon, User, Grid, Settings } from "lucide-react";
import LoginModal from "./LoginModal"; // Import the LoginModal component

export default function DesktopNavbar({
  darkMode,
  toggleDarkMode,
  categoriesOpen,
  toggleCategories,
  settingsOpen,
  toggleSettings,
  categoryRef = null, // Default to null in case it's not passed
}) {
  const router = useRouter(); // Initialize router
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing modal visibility

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigate with search query
    }
  };

  const clearSearch = () => {
    setSearchQuery(""); // Clear search input
    // Redirect to homepage only if the query is empty
    if (searchQuery.trim() === "") {
      router.push("/"); // Navigate to the homepage when search is cleared
    }
  };

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="hidden md:flex max-w-7xl mx-auto px-6 py-4 justify-between items-center bg-gray-900 text-white">
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold cursor-pointer text-gray-100"
      >
        PhotoGallery
      </motion.h1>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch} // Handle search submission
        className="hidden md:flex items-center bg-gray-800 border rounded-xl px-4 py-2 w-80 shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <Search size={20} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update state
          className="w-full bg-transparent outline-none text-sm text-gray-300"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch} // Clear search on button click
            className="ml-2 text-2xl text-gray-400 hover:text-gray-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </motion.form>

      {/* Right Section */}
      <div className="flex items-center space-x-8">
        {/* Categories Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={toggleCategories}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-300 transition-all duration-200 hover:bg-gray-700"
            aria-label="Toggle categories"
          >
            <Grid size={20} className="text-gray-400" />
            <span>Categories</span>
            <ChevronDown size={20} />
          </button>
          <AnimatePresence>
            {categoriesOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-52 bg-gray-800 border rounded-lg shadow-lg overflow-hidden"
              >
                {[
                  { name: "Nature", emoji: "🌿", path: "/nature" },
                  { name: "Architecture", emoji: "🏛️", path: "/architecture" },
                  { name: "Technology", emoji: "💻", path: "/technology" },
                  { name: "People", emoji: "👫", path: "/people" },
                  { name: "Food", emoji: "🍕", path: "/food" },
                ].map((category, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="hover:bg-gray-700 cursor-pointer transition-all"
                  >
                    <Link href={category.path} className="flex px-4 py-2 text-gray-300">
                      {category.emoji} {category.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={toggleSettings}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-300 transition-all duration-200 hover:bg-gray-700"
            aria-label="Toggle settings"
          >
            <Settings size={20} className="text-gray-400" />
            <span>Settings</span>
            <ChevronDown size={20} />
          </button>
          <AnimatePresence>
            {settingsOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-52 bg-gray-800 border rounded-lg shadow-lg overflow-hidden"
              >
                {["Account", "Privacy", "Notifications", "General"].map((setting, index) => (
                  <motion.li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    {setting}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-700"
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} className="text-gray-400" />}
        </motion.button>

        {/* Profile / Login */}
        <motion.button
          className="flex items-center text-center space-x-2 px-4 py-2 border rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          onClick={toggleModal} // Toggle modal visibility on click
          aria-label="Open login modal"
        >
          <User size={20} />
          <span>Sign In</span>
        </motion.button>
      </div>

      {/* Conditionally render the LoginModal */}
      <AnimatePresence>
        {isModalOpen && <LoginModal closeModal={toggleModal} />}
      </AnimatePresence>
    </div>
  );
}
