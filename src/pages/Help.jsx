// src/pages/Help.jsx
import React from "react";

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-white py-12 px-4">
      <div className="container mx-auto bg-white/90 border border-pink-100 rounded-3xl shadow-xl shadow-pink-100 p-8 backdrop-blur">
        <h1 className="text-2xl font-extrabold text-blue-950">Help / Resources</h1>
        <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
          <li>How to use this site — Start with “What do I teach?” then try interactive challenges.</li>
          <li>Contact instructor: gamified-ds@gmail.com</li>
          <li>Project resources: Sample datasets & practice problems will appear under modules.</li>
          <li>FAQ: If something breaks, open the browser console & report error with screenshot.</li>
        </ul>
      </div>
    </div>
  );
}
