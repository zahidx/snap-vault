"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Search, X, ZoomIn } from "lucide-react";
import ImageModal from "../ImageModal";

export default function ArchitecturePage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("architecture");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/unsplash?query=architecture&page=${page}&client_id=${API_KEY}`
      );
      setImages((prev) => [...prev, ...response.data.results]);
    } catch (err) {
      setError("Error fetching images, please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page, fetchImages]);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center bg-fixed text-white text-3xl font-bold tracking-wide" 
        style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}>
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
