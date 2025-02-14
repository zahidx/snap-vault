"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Sun, Moon, User, Grid, Settings } from "lucide-react";

export default function DesktopNavbar({
  darkMode,
  toggleDarkMode,
  categoriesOpen,
  toggleCategories,
  settingsOpen,
  toggleSettings,
  accountOpen,
  toggleAccount,
  categoryRef,
}) {
  return (
    <div className="hidden md:flex max-w-7xl mx-auto px-6 py-4 justify-between items-center">
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
      <div className="flex items-center space-x-6">
        {/* Categories Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={toggleCategories}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Grid size={18} className="text-gray-400" />
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
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                  >
                    <Link href={category.path} className="flex px-4 py-2">
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
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Settings size={18} className="text-gray-400" />
            <span>Settings</span>
            <ChevronDown size={18} />
          </button>
          <AnimatePresence>
            {settingsOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border rounded-lg shadow-lg overflow-hidden"
              >
                {["Account", "Privacy", "Notifications", "General"].map(
                  (setting, index) => (
                    <motion.li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      {setting}
                    </motion.li>
                  )
                )}
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
    </div>
  );
}
