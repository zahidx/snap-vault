"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, UserPlus, Eye } from "lucide-react";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPeople = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://randomuser.me/api/?results=12");
      setPeople(response.data.results);
    } catch (err) {
      setError("Failed to fetch people. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[100px] mt-20 flex items-center justify-center bg-cover bg-center text-white text-4xl font-bold tracking-wide" 
        style={{ backgroundImage: "url('/path-to-people-banner.jpg')" }}>
        Meet Our Community
      </div>

      

      {/* Grid Layout for People Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {people.map((person, index) => (
          <motion.div
            key={index}
            className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={person.picture.large}
              alt={person.name.first}
              className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500"
            />
            <h3 className="mt-3 text-lg font-semibold">
              {person.name.first} {person.name.last}
            </h3>
            <p className="text-sm text-gray-400">{person.location.country}</p>

            <div className="mt-4 flex justify-center gap-4">
              <motion.button
                className="bg-blue-500 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-blue-600 transition"
              >
                <UserPlus size={16} /> Follow
              </motion.button>
              <motion.button
                className="bg-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-600 transition"
              >
                <Eye size={16} /> View Profile
              </motion.button>
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
    </div>
  );
}
