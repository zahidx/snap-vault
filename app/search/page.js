"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // For debouncing

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Pagination state
  const [isEnd, setIsEnd] = useState(false); // To check if no more results

  const API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  // Fetch images with pagination
  const fetchImages = useCallback(async (page) => {
    if (!query || isEnd) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${API_KEY}&page=${page}&per_page=10`
      );

      if (response.data.results.length === 0) {
        setIsEnd(true); // Stop fetching if no more results
      } else {
        setImages((prevImages) => [...prevImages, ...response.data.results]);
      }
    } catch (err) {
      setError("Error fetching images, please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [query, API_KEY, isEnd]);

  // Debounced function to call fetchImages after typing stops
  const debouncedFetchImages = useDebouncedCallback((query) => {
    setImages([]); // Clear previous results
    setPage(1);
    setIsEnd(false);
    fetchImages(1);
  }, 500); // Debounce 500ms

  useEffect(() => {
    if (query) {
      debouncedFetchImages(query);
    }
  }, [query, debouncedFetchImages]);

  // Load more images when the user scrolls to the bottom
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || isEnd) return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) fetchImages(page);
  }, [page, fetchImages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, isEnd]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white">
        Search Results for "{query}"
      </h1>

      {loading && !images.length ? (
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-300 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : images.length === 0 ? (
        <p className="text-gray-400">No results found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-lg overflow-hidden shadow-lg"
              data-aos="zoom-in"
              data-aos-duration="1200"
            >
              <img
                src={image.urls.small}
                alt={image.alt_description || "Image"}
                className="w-full h-52 object-cover"
                loading="lazy" // Lazy loading for images
              />
              <p className="text-center text-gray-300 mt-2">
                {image.description || "Untitled"}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading more...</p>}
      {isEnd && <p className="text-center text-gray-500">No more results.</p>}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
