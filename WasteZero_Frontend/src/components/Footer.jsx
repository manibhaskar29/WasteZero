import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-300 border-t border-gray-300 dark:border-zinc-900 py-4 px-10 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {/* 🌿 Brand */}
        <div>
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
            <span className="text-gray-900 dark:text-white">Waste</span>Zero
          </h3>
          <p>
            Making waste management simple, efficient, and environmentally
            responsible.
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <a href="#how" className="hover:underline">
                How It Works
              </a>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p>
            <a
              href="mailto:support@wastezero.com"
              className="hover:underline"
            >
              support@wastezero.com
            </a>
          </p>
          <p>1-800-WASTE-ZERO</p>
        </div>
      </div>

      {/* 🌎 Bottom Bar */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 pt-4 mt-8">
        © 2025 WasteZero. All rights reserved. Making the world cleaner, one
        pickup at a time.
      </div>
    </footer>
  );
}