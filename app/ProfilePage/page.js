"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    // This will run only on the client side
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setUuid(queryParams.get("uuid"));
    }
  }, []);

  useEffect(() => {
    if (uuid) {
      const fetchPerson = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://randomuser.me/api/?results=1&uuid=${uuid}`);
          const data = await response.json();
          setPerson(data.results[0]); // Adjust based on the API response
        } catch (err) {
          setError("Failed to fetch profile details.");
        } finally {
          setLoading(false);
        }
      };

      fetchPerson();
    }
  }, [uuid]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1f2a3d] to-[#4b5c72] text-white p-6 mt-12">
      {/* Profile Container */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* Profile Header */}
        <div className="flex justify-center mb-6">
          <img
            src={person.picture.large}
            alt={`${person.name.first} ${person.name.last}`}
            className="w-28 h-28 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg transform transition-all duration-300 hover:scale-110"
          />
        </div>

        {/* Profile Details */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 mb-2">
            {person.name.first} {person.name.last}
          </h1>
          <p className="text-lg text-gray-300">{person.email}</p>
          <p className="text-md text-gray-400 mt-2">{person.location.city}, {person.location.country}</p>

          {/* About & Additional Information */}
          <div className="mt-6 space-y-6">
            <div className="bg-gray-700 p-4 rounded-xl shadow-md">
              <p className="text-lg font-semibold text-gray-200">About</p>
              <p className="mt-2 text-sm text-gray-300">{person.about || "No bio available"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-gray-200">Gender</p>
                <p className="mt-2 text-sm text-gray-300">{person.gender === 'male' ? 'He/Him' : person.gender === 'female' ? 'She/Her' : 'They/Them'}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-gray-200">Birthday</p>
                <p className="mt-2 text-sm text-gray-300">{new Date(person.dob.date).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-gray-200">Phone</p>
                <p className="mt-2 text-sm text-gray-300">{person.phone}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-gray-200">Nationality</p>
                <p className="mt-2 text-sm text-gray-300">{person.nat}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = "/people"} // Back to People List
            className="text-blue-500 hover:text-blue-700 transition-all duration-300 text-xl font-medium"
          >
            &larr; Back to People List
          </button>
        </div>
      </div>
    </div>
  );
}
