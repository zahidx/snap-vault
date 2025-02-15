"use client";
import "aos/dist/aos.css";
import AOS from "aos";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import ImageModal from "./ImageModal";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("nature");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your Unsplash API key

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/unsplash?query=${category}&client_id=${API_KEY}`
        );
        setImages(response.data.results);
      } catch (err) {
        setError("Error fetching images, please try again.");
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  // Initialize AOS when the component is mounted
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });

    return () => AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300">
      {/* Sidebar Toggle */}
      <button
        className="p-4 fixed top-4 left-4 z-50 bg-gray-800 dark:bg-gray-900 text-white rounded-sm "
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setCategory={setCategory}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center py-8">
        {/* Search & Filter Section */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-aos="fade-up" // Adding AOS fade-up animation
        >
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>

          {/* Category Selector */}
          <div className="relative w-full sm:w-40">
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md cursor-pointer focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-aos="fade-up" // Adding AOS fade-up animation
            >
              <option value="nature">Nature</option>
              <option value="tech">Tech</option>
              <option value="food">Food</option>
              <option value="animals">Animals</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={18} />
          </div>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="text-center text-red-500 py-4 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-aos="fade-up" // Adding AOS fade-up animation
        >
          {error}
        </motion.div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(img)}
            data-aos="fade-up" // Adding AOS fade-up animation for each image
          >
            <img
              src={img.urls.regular}
              alt={img.alt_description}
              className="w-full h-60 object-cover transition-all duration-300 group-hover:brightness-75"
              loading="lazy"
            />
            <motion.div
              className="absolute bottom-0 bg-black/50 text-white w-full text-center py-2 opacity-0 group-hover:opacity-100 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {img.user.name}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-6">
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Image Modal */}
      <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </div>
  );
}
