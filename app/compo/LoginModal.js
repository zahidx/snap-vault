import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "./firebase";
import { toast, ToastContainer } from "react-toastify"; // Correct import for ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

export default function LoginModal({ closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Function to show a toast notification
  const showToast = (message, type) => {
    toast(message, {
      type: type,
      position: "top-right",
      autoClose: 3000, // Auto close after 3 seconds
      hideProgressBar: true,
      closeButton: true,
      pauseOnHover: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
      showToast("Login successful!", "success"); // Show success toast
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error"); // Show error toast
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeModal();
      showToast("Login successful!", "success"); // Show success toast
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error"); // Show error toast
    }
  };

  const handleSignupRedirect = () => {
    setIsNavigating(true);
    setTimeout(() => {
      window.location.href = "/signup";
    }, 500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 pt-56 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={closeModal}
      >
        <div
          className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 sm:mx-auto relative z-60 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">Sign In</h2>
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
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none"
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
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sign in with Google
          </button>
          <p className="text-gray-400 mt-4 text-center">
            Don't have an account?{" "}
            <span
              onClick={handleSignupRedirect}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              {isNavigating ? "Loading..." : "Sign Up"}
            </span>
          </p>
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
          >
            ✕
          </button>
        </div>
      </motion.div>
      {/* Correct Toast container */}
      <ToastContainer />
    </>
  );
}
