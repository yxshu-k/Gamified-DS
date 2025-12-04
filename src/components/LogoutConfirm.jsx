import React from "react";

export default function LogoutConfirm({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center">
          <div className="text-6xl mb-4">🚪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm Logout
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to logout? Your progress will be saved.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

