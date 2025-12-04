import React, { useState, useEffect } from "react";
import codeChallenges from "../data/codeChallenges.json";

const getRandomIndex = (length, exclude = null) => {
  if (!length || length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === exclude) {
    next = Math.floor(Math.random() * length);
  }
  return next;
};

export default function CodeChallenge() {
  const [index, setIndex] = useState(() =>
    getRandomIndex(codeChallenges.length)
  );
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [motivation, setMotivation] = useState("");

  // Load the current challenge
  const challenge = codeChallenges[index];

  useEffect(() => {
    setUserCode(challenge.starterCode || "");
    setOutput("");
    setMotivation("");
  }, [index]);

  // Run user code safely
  const runCode = () => {
    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(" "));

      // Evaluate user code
      eval(userCode);

      console.log = originalLog;
      const result = logs.join("\n") || "✅ Code executed successfully!";
      setOutput(result);
      setMotivation(randomSuccessMessage());
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
      setMotivation(randomErrorMessage());
    }
  };

  // Move to next challenge
  const nextChallenge = () => {
    const next = getRandomIndex(codeChallenges.length, index);
    setIndex(next);
  };

  // Random motivational messages
  const successMessages = [
    "🔥 Excellent! You're coding like a pro!",
    "🚀 Great job! That’s how engineers think!",
    "💪 Brilliant! You’re mastering this concept!",
    "🌟 Amazing! Keep that momentum going!",
    "🧠 Genius move! Your logic is on point!"
  ];

  const errorMessages = [
    "💡 Don’t worry — every error is a teacher!",
    "🛠️ Debugging is part of engineering — keep trying!",
    "⚡ You’re getting closer, check your logic!",
    "🤔 Hmm… maybe rethink the function call?",
    "🧩 Errors mean you’re learning something new!"
  ];

  const randomSuccessMessage = () =>
    successMessages[Math.floor(Math.random() * successMessages.length)];

  const randomErrorMessage = () =>
    errorMessages[Math.floor(Math.random() * errorMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
        
        {/* Example Section */}
        <h1 className="text-2xl font-bold text-yellow-400 mb-3">
          💡 Example: {challenge.title}
        </h1>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
          {challenge.example}
        </pre>

        {/* Challenge Section */}
        <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-2">
          🚀 Challenge:
        </h2>
        <p className="text-gray-300 mb-3">{challenge.challenge}</p>

        {/* Code Editor */}
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          className="w-full h-56 bg-gray-900 text-green-300 font-mono text-sm rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
          spellCheck="false"
        />

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={runCode}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-xl shadow-md transition"
          >
            ▶ Run Code
          </button>
          <button
            onClick={nextChallenge}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition"
          >
            Next Challenge →
          </button>
        </div>

        {/* Output Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            💻 Output:
          </h3>
          <pre className="bg-black text-green-300 p-4 rounded-xl h-40 overflow-y-auto border border-gray-700">
            {output || "Run your code to see output here!"}
          </pre>
        </div>

        {/* Motivation Message */}
        {motivation && (
          <div className="mt-4 text-center text-lg font-semibold text-yellow-300 animate-pulse">
            {motivation}
          </div>
        )}
      </div>
    </div>
  );
}
