import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArraySim() {
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [indexInput, setIndexInput] = useState("");

  const handlePush = () => {
    if (input.trim() === "") return alert("Please enter a value!");
    setArray([...array, input]);
    setInput("");
  };

  const handlePop = () => {
    if (array.length === 0) return alert("Array is empty!");
    const newArray = [...array];
    newArray.pop();
    setArray(newArray);
  };

  const handleUnshift = () => {
    if (input.trim() === "") return alert("Please enter a value!");
    setArray([input, ...array]);
    setInput("");
  };

  const handleShift = () => {
    if (array.length === 0) return alert("Array is empty!");
    const newArray = [...array];
    newArray.shift();
    setArray(newArray);
  };

  const handleSplice = () => {
    if (input.trim() === "" || indexInput.trim() === "") {
      return alert("Please enter both value and index!");
    }
    const index = parseInt(indexInput);
    if (isNaN(index) || index < 0 || index > array.length) {
      return alert("Please enter a valid index!");
    }
    const newArray = [...array];
    newArray.splice(index, 0, input);
    setArray(newArray);
    setInput("");
    setIndexInput("");
  };

  const handleClear = () => {
    setArray([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">📊 Array Simulator</h1>

      {/* Input & Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter element"
          className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none"
        />
        <input
          type="text"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          placeholder="Index (for insert)"
          className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-32"
        />
        <button
          onClick={handlePush}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Push (End)
        </button>
        <button
          onClick={handlePop}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Pop (End)
        </button>
        <button
          onClick={handleUnshift}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Unshift (Start)
        </button>
        <button
          onClick={handleShift}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Shift (Start)
        </button>
        <button
          onClick={handleSplice}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Insert at Index
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Array Display */}
      <div className="flex flex-wrap items-center justify-center gap-3 min-h-[200px] w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg">
        <AnimatePresence>
          {array.length === 0 ? (
            <p className="text-gray-400 text-lg">Array is empty. Add some elements!</p>
          ) : (
            array.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`flex flex-col items-center justify-center w-20 h-20 text-white font-semibold rounded-lg shadow-md
                ${
                  ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"][
                    index % 6
                  ]
                }`}
              >
                <span className="text-sm">{item}</span>
                <span className="text-xs opacity-75">[{index}]</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Array representation */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">
          Array Representation:
        </h2>
        <p className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700 font-mono">
          [ {array.length > 0 ? array.map((item, i) => `"${item}"${i < array.length - 1 ? ", " : ""}`).join("") : ""} ]
        </p>
        <p className="text-sm text-gray-600 mt-2">Length: {array.length}</p>
      </div>

      {/* Info */}
      <div className="mt-6 text-gray-600 text-sm max-w-md text-center">
        <p>
          This simulation visually represents how an Array works. You can add elements
          at the beginning (unshift), end (push), or at a specific index (splice).
          Remove elements from the beginning (shift) or end (pop).
        </p>
      </div>
    </div>
  );
}
