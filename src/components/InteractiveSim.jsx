import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveSim() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");

  const handlePush = () => {
    if (input.trim() === "") return alert("Please enter a value!");
    setStack([...stack, input]);
    setInput("");
  };

  const handlePop = () => {
    if (stack.length === 0) return alert("Stack is empty!");
    const newStack = [...stack];
    newStack.pop();
    setStack(newStack);
  };

  const handleClear = () => {
    setStack([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">🧱 Stack Simulator</h1>

      {/* Input & Buttons */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter element"
          className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handlePush}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Push
        </button>
        <button
          onClick={handlePop}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Pop
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Stack Display */}
      <div className="flex flex-col-reverse items-center justify-end min-h-[300px] w-[180px] border-4 border-indigo-600 rounded-xl bg-white shadow-lg relative overflow-hidden">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item + index}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`w-32 text-center text-white font-semibold py-2 my-1 rounded-lg shadow-md
              ${
                ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-blue-500"][
                  index % 4
                ]
              }`}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stack label */}
        <div className="absolute top-2 left-2 text-xs text-gray-600">TOP</div>
      </div>

      {/* Array representation */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">
          Array Representation:
        </h2>
        <p className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md text-gray-700">
          [ {stack.join(", ")} ]
        </p>
      </div>

      {/* Info */}
      <div className="mt-6 text-gray-600 text-sm max-w-md text-center">
        <p>
          This simulation visually represents how a Stack works — 
          <strong> Last In, First Out (LIFO)</strong>. The topmost element is 
          always removed first. Try pushing and popping to see it in action!
        </p>
      </div>
    </div>
  );
}
