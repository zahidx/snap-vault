"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Search, ZoomIn } from "lucide-react";
import ImageModal from "../ImageModal";

export default function TechnologyPage() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("technology");
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
        `/api/unsplash?query=technology&page=${page}&client_id=${API_KEY}`
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center bg-fixed text-white text-3xl font-bold tracking-wide" 
        style={{ backgroundImage: "url('/path-to-hero-image.jpg')" }}>
        Future of Technology
      </div>

      

      {/* Grid for Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800 group transform hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.urls.regular}
              alt={img.alt_description}
              className="w-full h-56 object-cover rounded-t-lg"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{img.user.name}</h3>
              <p className="text-sm text-gray-400">{img.alt_description}</p>
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center p-4">
              <ZoomIn className="text-white" size={24} />
              <a href={img.urls.full} download>
                <Download className="text-white" size={24} />
              </a>
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
