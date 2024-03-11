import React, { useState } from "react";
import FAQ from "../FAQ";
import DecisionTree from "../DecisionTree";
import Dropdown from "../Dropdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Function to handle user submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() !== "") {
      // Add user's message to chat history
      setChatHistory([
        ...chatHistory,
        { sender: "user", message: userInput.trim() },
      ]);
      // Process user input
      processUserInput(userInput.trim());
      // Reset user input field
      setUserInput("");
    }
  };

  // Function to process user input
  const processUserInput = (input) => {
    // Placeholder implementation for demo
    // You can implement your logic to determine the best response or component to use

    // Default response
    let response = {
      sender: "bot",
      message: "I'm sorry, I couldn't understand your question.",
    };

    // Implement logic to determine the best response or component to use
    if (input.toLowerCase() === "faq") {
      // Handle FAQ-based retrieval
      response = { sender: "bot", message: "Sure, ask me anything!" };
    } else if (input.toLowerCase() === "decision tree") {
      // Handle decision tree logic
      // For demo, I'm sending a predefined question to the decision tree component
      response = {
        sender: "bot",
        message: (
          <DecisionTree currentQuestion="question1" handleDecision={() => {}} />
        ),
      };
    } else if (input.toLowerCase() === "dropdown") {
      // Handle dropdown menu
      // For demo, I'm sending a predefined options list to the dropdown component
      const options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ];
      response = {
        sender: "bot",
        message: <Dropdown options={options} handleChange={() => {}} />,
      };
    }

    // Add response to chat history
    setChatHistory([...chatHistory, response]);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-history">
        {chatHistory.map((item, index) => (
          <div key={index} className={`message ${item.sender}`}>
            {item.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="user-input-form">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="How can I assist you?"
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
      {/* Include only one component for FAQ, decision tree, or dropdown */}
    </div>
  );
};

export default Chatbot;
