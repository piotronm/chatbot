import React from "react";

const Dropdown = ({ options, handleChange }) => {
  return (
    <div className="dropdown">
      <select onChange={(e) => handleChange(e.target.value)}>
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
