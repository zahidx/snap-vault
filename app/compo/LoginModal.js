import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from './firebase';  // Firebase import

export default function LoginModal({ closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

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
        if (isSignup) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        setIsLoading(false);
        closeModal();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 pt-[355px] bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 sm:mx-auto relative z-60 shadow-lg transition-all transform hover:scale-105"
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">{isSignup ? "Sign Up" : "Sign In"}</h2>
        {error && (
          <div className="text-red-500 mb-4 text-center" role="alert" aria-live="assertive" aria-describedby="error-message">
            <span id="error-message">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
            <div className="p-2">
              <FaEnvelope className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
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
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16V4H4z" />
              </svg>
            ) : (
              isSignup ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>

        {/* Sign In with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center"
        >
          <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 12c-3.314 0-6-2.686-6-6s2.686-6 6-6c1.626 0 3.1.63 4.208 1.734l3.891-3.891C18.414 1.314 15.354 0 12 0 5.372 0 0 5.372 0 12s5.372 12 12 12c5.354 0 9.414-3.314 11.099-7.734l-3.891-3.891C15.1 11.37 13.626 12 12 12z" />
          </svg>
          Sign in with Google
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:text-blue-400 text-sm"
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
