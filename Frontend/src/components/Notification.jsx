import React from "react";

export default function Notification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
      {message}
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
}
