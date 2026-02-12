import React from "react";

function Button({ onClick, disabled, variant = "primary", children, className = "" }) {
  const baseStyles = "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    like: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    liked: "bg-red-500 text-white hover:bg-red-600",
    publish: "px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  };

  const variantStyles = variants[variant] || variants.primary;
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
