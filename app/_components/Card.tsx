// components/ui/Card.jsx
import React from "react";
import clsx from "clsx";
export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-2xl shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// components/ui/CardContent.jsx

export function CardContent({ children, className, ...props }) {
  return (
    <div className={clsx("p-6", className)} {...props}>
      {children}
    </div>
  );
}
