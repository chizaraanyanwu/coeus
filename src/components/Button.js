// Button.js

// Button component
import React from "react";
import "../css/Button.css"; // Import your CSS file


const Button = ({ color, label, onClick }) => {
  return (
    <button
      className={`custom-button background-light-${color} hover:background-dark-${color}`}
      onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
