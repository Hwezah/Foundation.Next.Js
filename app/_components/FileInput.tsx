import React from "react";

export default function FileInput({ id, className = "", ...props }) {
  return (
    <input
      type="file"
      id={id}
      className={`block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        cursor-pointer
        ${className}`}
      {...props}
    />
  );
}

// Usage...<FileInput id="cabin-photo" accept="image/*" />
