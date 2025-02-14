"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Menu } from "lucide-react";
import Sidebar from "../Sidebar"; // Optional: if you still want the sidebar
import ImageModal from "../ImageModal"; // Import ImageModal.js
import AOS from "aos"; // Import AOS for scroll animations
import "aos/dist/aos.css"; // Import the AOS styles

export default function NaturePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your Unsplash API key

  // Fetch images from the API with error handling and retry mechanism
  const fetchImages = async () => {
    setLoading(true);
    setError(null); // Reset error state on new fetch
    try {
      const response = await axios.get(
        `/api/unsplash?query=${query}&client_id=${API_KEY}`
      );
      setImages(response.data.results); // Set all images directly without paging
    } catch (err) {
      setError("Error fetching images, please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  // On mount or query change, fetch images
  useEffect(() => {
    fetchImages();
  }, [query]); // Re-fetch images when the query changes

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* Hero Section */}
      <div 
        className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center bg-fixed text-white text-3xl font-bold tracking-wide" 
        style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}
        data-aos="fade-up"
      >
        Nature
      </div>

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
    

      {/* Image Gallery */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6"
        data-aos="fade-up"
      >
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(img)} // Open ImageModal on click
            data-aos="zoom-in"
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
            data-aos="fade-up"
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
