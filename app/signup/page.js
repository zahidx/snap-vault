"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaPhone } from "react-icons/fa";
import { auth } from "../compo/firebase"; // Ensure the path is correct
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // emailSent indicates that a verification email has been sent
  const [emailSent, setEmailSent] = useState(false);
  // isVerified indicates that the user has verified their email (after clicking "Check Verification")
  const [isVerified, setIsVerified] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validations for required fields
    if (!displayName || !email || !phoneNumber || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name (phone number can be stored elsewhere)
      await updateProfile(userCredential.user, { displayName });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Clear all form fields after successful signup
      setDisplayName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      
      setEmailSent(true);
      console.log("User signed up successfully. Verification email sent.");
    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setError("");
    try {
      // Reload the current user's data from Firebase
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setIsVerified(true);
        } else {
          setError("Email is not verified yet. Please check your inbox.");
        }
      }
    } catch (error) {
      console.error("Error checking verification:", error.message);
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Signed in with Google successfully");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for phone authentication logic
  const handlePhoneSignup = () => {
    console.log("Phone signup clicked");
    setError("Phone signup is not implemented yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-8">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 sm:mx-auto shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Sign Up</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {!emailSent && (
          <form onSubmit={handleSignup}>
            {/* Display Name */}
            <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
              <div className="p-2">
                <FaUser className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            {/* Email */}
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
            {/* Phone Number */}
            <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
              <div className="p-2">
                <FaPhone className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            {/* Password */}
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
            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v16h16V4H4z"
                  />
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        {emailSent && !isVerified && (
          <div className="mb-4 text-center">
            <div className="text-yellow-500 mb-4">
              Verification email sent. Please check your inbox.
            </div>
            <button
              onClick={handleCheckVerification}
              className="w-full py-2 mb-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v16h16V4H4z"
                  />
                </svg>
              ) : (
                "Check Verification"
              )}
            </button>
          </div>
        )}

        {isVerified && (
          <div className="text-green-500 mb-4 text-center">
            Email verified successfully, you can login now.
          </div>
        )}

        {/* Social/Alternative Signup Buttons */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600"
            disabled={isLoading}
            title="Sign up with Google"
          >
            <FaGoogle className="h-6 w-6 text-white" />
          </button>
          {/* Phone Signup Button */}
          <button
            onClick={handlePhoneSignup}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600"
            disabled={isLoading}
            title="Sign up with Phone"
          >
            <FaPhone className="h-6 w-6 text-white" />
          </button>
        </div>
        {/* Already have an account? Login */}
        <div className="text-center">
          <span className="text-gray-300">Already have an account? </span>
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
