"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

export default function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [likedFoods, setLikedFoods] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  useEffect(() => {
    // Initialize AOS with 'once: false' so animations trigger every time on scroll
    AOS.init({
      duration: 1000,
      once: false, // Trigger animation every time element comes into view
      offset: 200, // Optional: Adds offset for triggering the animation earlier/later
    });

    const fetchFoods = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setFoods(response.data.meals.slice(0, 12)); // Fetch all food items once
      } catch (err) {
        setError("Failed to fetch food items. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods(); // Fetch foods when the component mounts
  }, []);

  const toggleLike = (id) => {
    setLikedFoods((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div
        className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center text-white text-4xl font-bold"
        style={{ backgroundImage: "url('/path-to-food-banner.jpg')" }}
      >
        Delicious Dishes
      </div>

      {/* Grid of Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {foods.map((food, index) => (
          <motion.div
            key={food.idMeal}
            className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden text-center transform hover:scale-105 transition-transform duration-300"
            data-aos={index % 2 === 0 ? "fade-up" : "fade-down"} // Different animations for odd/even items
            data-aos-once="false" // Make sure the animation re-triggers every scroll
          >
            <img
              src={food.strMealThumb}
              alt={food.strMeal}
              className="w-full h-52 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{food.strMeal}</h3>
              <p className="text-sm text-gray-400">{food.strArea} Cuisine</p>

              <div className="mt-4 flex justify-center gap-4">
                <motion.button
                  className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition ${
                    likedFoods.has(food.idMeal) ? "bg-red-600" : "bg-gray-700"
                  }`}
                  onClick={() => toggleLike(food.idMeal)}
                >
                  <Heart
                    size={16}
                    className={`${
                      likedFoods.has(food.idMeal)
                        ? "text-white fill-current"
                        : "text-gray-300"
                    }`}
                  />
                  {likedFoods.has(food.idMeal) ? "Liked" : "Like"}
                </motion.button>

                <motion.button
                  className="bg-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-600 transition"
                  onClick={() => router.push(`/food/${food.idMeal}`)}
                >
                  <Eye size={16} /> View Recipe
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-6">
          <motion.div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}
