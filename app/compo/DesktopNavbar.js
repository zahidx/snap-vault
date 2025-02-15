"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  categoryRef = null,
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current page path
  const lastRoute = useRef(pathname); // Store last visited route

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update last visited route before performing a search
  useEffect(() => {
    if (!searchQuery) {
      lastRoute.current = pathname;
    }
  }, [pathname, searchQuery]);

  // Debounce search input for better performance
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  const clearSearch = () => {
    setSearchQuery("");
    router.push(lastRoute.current); // Redirect to previous page instead of home
  };

  return (
    <div className="hidden md:flex max-w-7xl mx-auto px-6 py-4 justify-between items-center bg-gray-900 text-white">
      {/* Logo */}
<Link href="/">
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-4xl font-extrabold cursor-pointer text-gray-100"
  >
    SnapVault
  </motion.h1>
</Link>

      {/* Search Bar */}
      <motion.div
        className="hidden md:flex items-center bg-gray-800 border rounded-xl px-4 py-2 w-80 shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <Search size={20} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-300"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 text-2xl text-gray-400 hover:text-gray-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </motion.div>

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

        {/* Profile / Login */}
        <motion.button
          className="flex items-center text-center space-x-2 px-4 py-2 border rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsModalOpen((prev) => !prev)}
          aria-label="Open login modal"
        >
          <User size={20} />
          <span>Sign In</span>
        </motion.button>
      </div>

      {/* Conditionally render the LoginModal */}
      <AnimatePresence>
        {isModalOpen && <LoginModal closeModal={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
