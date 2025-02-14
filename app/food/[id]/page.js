"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setRecipe(response.data.meals?.[0] || null);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  // Split instructions into steps
  const instructionsSteps = recipe?.strInstructions?.split('\n').filter(step => step.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0E1628] to-[#380643] text-white p-10">
      {/* Back Button */}
      <motion.button
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-12 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => router.push("/food")}
        whileHover={{ scale: 1.1, rotate: -8 }}
      >
        <ArrowLeft size={24} /> Back
      </motion.button>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-12">
          <motion.div
            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </div>
      ) : recipe ? (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          <motion.img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-96 object-cover rounded-t-3xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className="p-10 space-y-8">
            {/* Recipe Title */}
            <motion.h2
              className="text-4xl font-extrabold text-white tracking-wide"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {recipe.strMeal}
            </motion.h2>
            <p className="text-sm text-gray-400 italic">{recipe.strArea} Cuisine</p>

            {/* Ingredients Section */}
            <div>
              <motion.h3
                className="text-2xl font-semibold mt-6 text-indigo-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Ingredients:
              </motion.h3>
              <ul className="text-lg text-gray-300 list-disc list-inside mt-4">
                {Array.from({ length: 10 }, (_, i) => i + 1)
                  .map((i) => ({
                    ingredient: recipe[`strIngredient${i}`],
                    measure: recipe[`strMeasure${i}`],
                  }))
                  .filter((item) => item.ingredient)
                  .map((item, index) => (
                    <motion.li
                      key={index}
                      className="transition-all duration-300 text-lg hover:text-indigo-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="font-medium">{item.ingredient}</span> - {item.measure}
                    </motion.li>
                  ))}
              </ul>
            </div>

            {/* Instructions Section (Line by Line) */}
            <div>
              <motion.h3
                className="text-2xl font-semibold mt-6 text-indigo-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Instructions:
              </motion.h3>
              <ol className="text-lg text-gray-300 space-y-4 mt-4">
                {instructionsSteps?.map((step, index) => (
                  <motion.li
                    key={index}
                    className="transition-all duration-300 hover:text-indigo-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Social Sharing */}
            <div className="flex space-x-6 mt-8 justify-center">
              <motion.a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                className="text-white hover:text-blue-600 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
              >
                Facebook
              </motion.a>
              <motion.a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target="_blank"
                className="text-white hover:text-blue-400 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
              >
                Twitter
              </motion.a>
              <motion.a
                href={`https://www.pinterest.com/pin/create/button/?url=${window.location.href}`}
                target="_blank"
                className="text-white hover:text-red-600 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
              >
                Pinterest
              </motion.a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-2xl mt-16">Recipe not found.</div>
      )}
    </div>
  );
}
