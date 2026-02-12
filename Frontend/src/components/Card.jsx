import React from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-6 transition-all duration-300 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export default Card;
