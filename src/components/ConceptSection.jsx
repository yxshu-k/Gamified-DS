// src/components/ConceptSection.jsx
import React from "react";

export default function ConceptSection({ topic = "Array" }) {
  const content = {
    Array: {
      title: "Array — Concept Explanation",
      bullets: [
        "Fixed-size contiguous block of memory.",
        "Elements indexed starting from 0; access by index is O(1).",
        "Insert/delete in middle may require shifting elements (O(n)).",
      ],
    },
    Stack: {
      title: "Stack — Concept Explanation",
      bullets: [
        "LIFO (Last-In, First-Out) linear data structure.",
        "Typical operations: push (add), pop (remove), peek (top).",
        "Used in recursion, expression evaluation, undo features.",
      ],
    },
  };

  const t = content[topic] || content.Array;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-3">{t.title}</h2>
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        {t.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        Tip: Try the simulation to the right to see how operations affect the structure.
      </p>
    </div>
  );
}
