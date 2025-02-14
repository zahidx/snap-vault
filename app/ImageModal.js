"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download } from "lucide-react";

export default function ImageModal({ selectedImage, setSelectedImage }) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Close modal on Esc key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedImage]);

  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsZoomed(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-md z-50"
        onClick={handleOutsideClick}
        aria-labelledby="image-modal"
      >
        <motion.div
          className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Close button */}
          <button
            className="absolute -top-1 right-0 text-gray-600 dark:text-gray-400 hover:text-red-500 transition"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <X size={30} />
          </button>

          {/* Image container */}
          <div className="w-full max-h-[60vh] overflow-hidden flex justify-center items-center">
            <img
              src={selectedImage.urls.full}
              alt={selectedImage.alt_description}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedImage.user.name}
            </span>
            <div className="flex items-center">
              {/* Zoom button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
                aria-label="Zoom image"
              >
                <ZoomIn size={20} />
              </button>

              {/* Download button */}
              <a
                href={selectedImage.links.download}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Download size={18} className="mr-2" />
                Download
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Zoomed view */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={selectedImage.urls.full}
              alt={selectedImage.alt_description}
              className="w-[90vw] h-[90vh] object-contain"
            />
            <button
              className="absolute top-6 right-6 text-white hover:text-red-500 transition"
              onClick={() => setIsZoomed(false)}
              aria-label="Close zoomed image"
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
