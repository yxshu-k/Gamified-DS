import React, { useState } from "react";
import ConceptSection from "../components/ConceptSection";
import ArraySim from "../components/ArraySim";
import ArrayQuizSection from "../components/ArrayQuizSection";
import ArrayCodeChallenge from "../components/ArrayCodeChallenge";
import ArrayStoryMission from "../components/ArrayStoryMission";

export default function ArrayPage() {
  const [activeSection, setActiveSection] = useState("concept");

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-white text-blue-950 px-4 sm:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-6 text-center">
        Array - Learn by Doing 🚀
      </h1>

      {/* Navigation Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeSection === "concept"
              ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
              : "bg-white/80 border border-pink-200 text-blue-950"
          }`}
          onClick={() => setActiveSection("concept")}
        >
          Concept
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeSection === "interactive"
              ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
              : "bg-white/80 border border-pink-200 text-blue-950"
          }`}
          onClick={() => setActiveSection("interactive")}
        >
          Drag & Drop
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeSection === "quiz"
              ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
              : "bg-white/80 border border-pink-200 text-blue-950"
          }`}
          onClick={() => setActiveSection("quiz")}
        >
          Quiz
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeSection === "code"
              ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
              : "bg-white/80 border border-pink-200 text-blue-950"
          }`}
          onClick={() => setActiveSection("code")}
        >
          Code Challenge
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeSection === "story"
              ? "bg-pink-600 text-white shadow-xl shadow-pink-200"
              : "bg-white/80 border border-pink-200 text-blue-950"
          }`}
          onClick={() => setActiveSection("story")}
        >
          Story Mission
        </button>
      </div>

      {/* Render Section */}
      <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-xl shadow-sky-100/60 p-6 backdrop-blur">
        {activeSection === "concept" && <ConceptSection topic="Array" />}
        {activeSection === "interactive" && <ArraySim />}
        {activeSection === "quiz" && <ArrayQuizSection />}
        {activeSection === "code" && <ArrayCodeChallenge />}
        {activeSection === "story" && <ArrayStoryMission />}
      </div>
    </div>
  );
}
