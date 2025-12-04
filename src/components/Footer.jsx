// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <img src="/logo.png" alt="Gamified-ds" className="h-10 mb-2" />
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Gamified-ds.</p>
          <p className="text-xs text-gray-500 mt-2">Citation: Template inspired by Wix “Tutor” template. Adapted for Gamified-ds.</p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col">
            <Link to="/about" className="text-gray-700">About</Link>
            <Link to="/" className="text-gray-700 mt-2">Home</Link>
            <Link to="/stack" className="text-gray-700 mt-2">Stack</Link>
            <Link to="/array" className="text-gray-700 mt-2">Array</Link>
            <Link to="/login" className="text-gray-700 mt-2">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
