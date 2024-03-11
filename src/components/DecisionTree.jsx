import React from "react";

const DecisionTree = ({ currentQuestion, handleDecision }) => {
  // Define the decision tree structure (replace with your actual decision tree)
  const decisionTree = {
    question1: {
      prompt: "What do you want to do?",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
    },
    option1: {
      prompt: "You chose Option 1. What next?",
      options: [
        { label: "Suboption 1", value: "suboption1" },
        { label: "Suboption 2", value: "suboption2" },
      ],
    },
    // Add more branches and options as needed...
  };

  return (
    <div className="decision-tree">
      <p>{decisionTree[currentQuestion].prompt}</p>
      <ul>
        {decisionTree[currentQuestion].options.map((option) => (
          <li key={option.value}>
            <button onClick={() => handleDecision(option.value)}>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DecisionTree;
