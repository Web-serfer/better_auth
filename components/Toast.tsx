import React from "react";

interface ToasterProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToasterProps) => {
  const bgColor = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  }[type];

  return (
    <div
      className={`border-l-4 p-4 ${bgColor} rounded shadow-lg mb-2 min-w-[300px]`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <p>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
