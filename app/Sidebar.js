import { motion } from "framer-motion";
import { Search, XCircle } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Nature", emoji: "🌿", id: "nature" },
    { name: "Tech", emoji: "💻", id: "tech" },
    { name: "Food", emoji: "🍕", id: "food" },
    { name: "Animals", emoji: "🐶", id: "animals" },
    { name: "Travel", emoji: "✈️", id: "travel" },
    { name: "Music", emoji: "🎶", id: "music" },
    { name: "Art", emoji: "🎨", id: "art" },
    { name: "Sports", emoji: "🏀", id: "sports" },
    { name: "Movies", emoji: "🎬", id: "movies" },
    { name: "Books", emoji: "📚", id: "books" },
    { name: "Gaming", emoji: "🎮", id: "gaming" },
    { name: "Fitness", emoji: "🏋️‍♂️", id: "fitness" },
    { name: "Health", emoji: "💊", id: "health" },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setCategory(category);
    setIsSidebarOpen(false); // Close sidebar after category selection
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 w-56 h-full bg-gray-800 text-white dark:bg-gray-900 p-6 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-40`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isSidebarOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filter by Genre</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-white focus:outline-none"
          aria-label="Close Sidebar"
        >
          <XCircle size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 mt-10">
        <div className="relative">
          <input
            type="text"
            className="w-40 py-2 px-4 text-sm  rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search Categories"
          />
          
        </div>
      </div>

      {/* Categories List */}
      <ul>
        {filteredCategories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className="block py-2 px-4 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded flex items-center"
              aria-label={`${category.name} category`}
            >
              <span className="mr-3">{category.emoji}</span>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
