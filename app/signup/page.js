"use client";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth } from "../compo/firebase"; // Make sure this path is correct

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPassword.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include a number, an uppercase letter, and a special character.");
    } else {
      setError("");
      setIsLoading(true);

      try {
        // Firebase sign-up process
        await auth.createUserWithEmailAndPassword(email, password);
        console.log("User signed up successfully");
        setIsLoading(false);
      } catch (error) {
        console.error("Error signing up:", error.message);
        setIsLoading(false);
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-8">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 sm:mx-auto shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Sign Up</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
            <div className="p-2">
              <FaEnvelope className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6 flex items-center border border-gray-600 rounded-lg">
            <div className="p-2">
              <FaLock className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16V4H4z" />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
