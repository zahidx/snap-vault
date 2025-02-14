"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Search, X } from "lucide-react";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch images from the custom Next.js API route
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/unsplash?query=${query}&page=${page}`);
      setImages((prev) => [...prev, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setImages([]); // Reset images when query changes
    setPage(1);
    fetchImages();
  }, [query]);

  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page]);

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
      {/* Search Bar */}
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
          />
        </motion.div>
      </div>

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
              className="w-full h-60 object-cover"
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
          </motion.div>
        </div>
      )}
    </div>
  );
}
