"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, ZoomIn } from "lucide-react";
import ImageModal from "../ImageModal";
import AOS from "aos";
import "aos/dist/aos.css"; // Don't forget to import AOS CSS

export default function ArchitecturePage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your Unsplash API key

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/unsplash?query=architecture&page=1&client_id=${API_KEY}`
      );
      setImages(response.data.results); // Fetch all images once
    } catch (err) {
      setError("Error fetching images, please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(); // Fetch all images when the component mounts
    AOS.init({
      duration: 1200,  // Increasing the duration for smoother animation
      easing: "ease-out-cubic",  // Using a smoother easing function
      once: false,  // Allow animations to repeat every time they come into view
    });
    window.addEventListener("scroll", AOS.refresh); // Refresh AOS on scroll
    return () => {
      window.removeEventListener("scroll", AOS.refresh); // Clean up the event listener
    };
  }, [fetchImages]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div
        className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center bg-fixed text-white text-3xl font-bold tracking-wide"
        style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-easing="ease-out-cubic" // Added a smoother easing function
      >
        Architectural Wonders
      </div>

      {/* Masonry Grid for Images */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-6">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="relative mb-4 overflow-hidden rounded-lg shadow-lg cursor-pointer group"
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedImage(img)}
            data-aos="zoom-in"
            data-aos-duration="1200"  // Increased duration for smoother effect
            data-aos-delay="200"
            data-aos-easing="ease-out-cubic" // Added a smoother easing function
          >
            <img
              src={img.urls.regular}
              alt={img.alt_description}
              className="w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <p className="text-white text-lg">{img.user.name}</p>
              <div className="flex justify-between">
                <ZoomIn className="text-white" size={24} />
                <a href={img.urls.full} download>
                  <Download className="text-white" size={24} />
                </a>
              </div>
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
        <ImageModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
}
