import React from "react";

function CharacterCounter({ current, max }) {
  return (
    <span className={`text-sm font-medium ${current > max - 30 ? "text-red-500" : "text-gray-500"}`}>
      {current}/{max}
    </span>
  );
}

export default CharacterCounter;
