import React, { useState } from "react";
import "./Chatbot.css";

const decisionTree = {
  1: {
    question: "What is your name?",
    options: null,
    nextStep: 2,
  },
  2: {
    question: "How can I assist you today?",
    options: ["Option A", "Option B"],
    responses: {
      "Option A": "Response to Option A",
      "Option B": "Response to Option B",
    },
  },
};

function Chatbot() {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    console.log("User message:", message);
    setMessages([...messages, { text: message, isUser: true }]);
    handleResponse(message);
  };

  const handleResponse = (message) => {
    const currentStep = decisionTree[step];
    console.log("Current step:", currentStep);
    const { options, responses, nextStep } = currentStep;

    if (options === null) {
      console.log("No options, moving to next step:", nextStep);
      setStep(nextStep);
      setMessages([...messages, { text: message, isUser: false }]);
    } else if (options.includes(message)) {
      console.log("User selected option:", message);
      setMessages([...messages, { text: message, isUser: false }]);
      setMessages([...messages, { text: responses[message], isUser: true }]);
    } else {
      console.log("Invalid user input, asking again.");
      setMessages([
        ...messages,
        {
          text: "Sorry, I didn't understand. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.isUser ? "user-message" : "bot-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.target.value);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default Chatbot;
