"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; // Social media icons
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Aos from "aos"; // Importing AOS
import "aos/dist/aos.css"; // Importing AOS CSS

export default function Footer() {
  const router = useRouter();

  useEffect(() => {
    Aos.init({ duration: 1000, once: false }); // Initializing AOS
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#0E1628] to-[#380643] text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo / Brand Name with AOS animation */}
          <div
            className="text-center md:text-left"
            data-aos="fade-up" // Animation when scrolled up
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <h2 className="text-3xl font-bold tracking-wide">SnapVault</h2>
            <p
              className="text-gray-400 mt-2"
              data-aos="fade-down" // Animation when scrolled down
              data-aos-easing="ease-out-cubic"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              Capturing moments, one click at a time
            </p>
          </div>

          {/* Navigation Links */}
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg"
            data-aos="fade-up" // Animation when scrolled up
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1000"
            data-aos-delay="900"
          >
            {["Home", "Gallery", "About Us", "Contact"].map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
                className="hover:text-indigo-400"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Social Media Links */}
          <div
            className="flex justify-center md:justify-end space-x-6"
            data-aos="fade-up" // Animation when scrolled up
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1000"
            data-aos-delay="1200"
          >
            {[
              { icon: Facebook, link: "https://facebook.com" },
              { icon: Twitter, link: "https://twitter.com" },
              { icon: Instagram, link: "https://instagram.com" },
              { icon: Linkedin, link: "https://linkedin.com" },
            ].map(({ icon: Icon, link }, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400"
              >
                <Icon size={28} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Text */}
        <div
          className="text-center text-gray-400 text-sm mt-8 border-t border-gray-600 pt-4"
          data-aos="fade-up" // Animation when scrolled up
          data-aos-easing="ease-out-cubic"
          data-aos-duration="1000"
          data-aos-delay="1500"
        >
          &copy; {new Date().getFullYear()} SnapVault. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
