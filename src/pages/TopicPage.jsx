// src/pages/TopicPage.jsx
import React, { useState } from "react";
import ConceptSection from "../components/ConceptSection";
import InteractiveSim from "../components/InteractiveSim";
import DragDropGame from "../components/DragDropGame";

export default function TopicPage({ initial = "Array" }) {
  const [topic, setTopic] = useState(initial); // "Array" or "Stack"

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-3">
          <button onClick={() => setTopic("Array")} className={`px-3 py-1 rounded ${topic==="Array" ? "bg-indigo-600 text-white": "bg-white"}`}>Array</button>
          <button onClick={() => setTopic("Stack")} className={`px-3 py-1 rounded ${topic==="Stack" ? "bg-indigo-600 text-white": "bg-white"}`}>Stack</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ConceptSection topic={topic} />
          <InteractiveSim topic={topic} initialSize={8} />
        </div>

        <div>
          <DragDropGame topic={topic} slots={6} />
        </div>
      </div>
    </div>
  );
}
