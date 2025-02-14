// HomePage.js
"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Search, X, ZoomIn, ChevronDown, Menu } from "lucide-react";
import Sidebar from "./Sidebar"; // Import Sidebar component

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("nature");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your Unsplash API key

  // Fetch images from the API with error handling and retry mechanism
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state on new fetch
    try {
      const response = await axios.get(
        `/api/unsplash?query=${category}&page=${page}&client_id=${API_KEY}`
      );
      setImages((prev) => [...prev, ...response.data.results]);
    } catch (err) {
      setError("Error fetching images, please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    setImages([]); // Reset images when category changes
    setPage(1);
    fetchImages();
  }, [category, fetchImages]);

  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page, fetchImages]);

  // Handle Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar Toggle */}
      <button
        className="p-4 pb-10 mt-2 fixed top-0 left-0 z-50 bg-gray-800 text-white dark:bg-gray-900"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setCategory={setCategory}
      />

      {/* Main Content */}
      <div className="flex justify-center items-center py-6 space-x-4">
        <motion.div
          className="flex items-center border rounded-lg px-4 py-2 w-80 bg-white dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <Search className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search images..."
            className="w-full bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>

        {/* Category Selector */}
        <motion.div
          className="relative flex items-center border rounded-lg px-4 py-2 w-40 bg-white dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <span className="mr-2 text-gray-500">Category:</span>
          <select
            className="bg-transparent outline-none text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="nature">Nature</option>
            <option value="tech">Tech</option>
            <option value="food">Food</option>
            <option value="animals">Animals</option>
          </select>
          <ChevronDown size={16} className="ml-2 text-gray-500" />
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 py-4">
          <p>{error}</p>
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.urls.regular}
              alt={img.alt_description}
              className="w-full h-60 object-cover lazyload"
              loading="lazy" // Enable lazy loading for images
            />
            <div className="absolute bottom-0 bg-black/50 text-white w-full text-center py-2">
              {img.user.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-6">
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
          />
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-md z-50">
          <motion.div
            className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage.urls.full}
              alt={selectedImage.alt_description}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm">{selectedImage.user.name}</span>
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedImage({ ...selectedImage, zoom: !selectedImage.zoom })}
                  className="mr-4 text-gray-600 dark:text-gray-400"
                >
                  <ZoomIn size={20} />
                </button>
                <a
                  href={selectedImage.links.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <Download size={18} className="mr-2" />
                  Download
                </a>
              </div>
            </div>
            {/* Zooming feature (can be expanded with more logic) */}
            {selectedImage.zoom && (
              <motion.div
                className="absolute inset-0 bg-black/70 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={selectedImage.urls.full}
                  alt={selectedImage.alt_description}
                  className="w-3/4 h-auto"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
