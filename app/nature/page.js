"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Search, X, ZoomIn, Menu } from "lucide-react";
import Sidebar from "../Sidebar"; // Optional: if you still want the sidebar
import ImageModal from "../ImageModal"; // Import ImageModal.js

export default function NaturePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Category is fixed to "nature"
  const category = "nature";
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

  // On mount or page change, fetch nature images
  useEffect(() => {
    // Reset images when the component mounts
    setImages([]);
    setPage(1);
    fetchImages();
  }, [fetchImages]);

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
      {/* Sidebar Toggle (if using sidebar) */}
      <button
        className="p-4 pb-[42px] pt-2 fixed top-0 left-0 z-50 bg-gray-800 text-white dark:bg-gray-900"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Optional Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex justify-center items-center py-6">
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
            disabled // Optionally disable search since we're focusing on nature
          />
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
            onClick={() => setSelectedImage(img)} // Open ImageModal on click
          >
            <img
              src={img.urls.regular}
              alt={img.alt_description}
              className="w-full h-60 object-cover lazyload"
              loading="lazy"
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

      {/* Image Modal (Imported) */}
      {selectedImage && (
        <ImageModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage} // Pass the state setter
        />
      )}
    </div>
  );
}
