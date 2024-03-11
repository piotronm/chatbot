import React, { useState } from "react";

const FAQ = ({ faqData }) => {
  const [userQuery, setUserQuery] = useState("");
  const [faqResponse, setFaqResponse] = useState("");

  // Function to handle user input
  const handleUserInput = (e) => {
    setUserQuery(e.target.value);
  };

  // Function to handle user query submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Search the FAQ database for a matching question
    const matchingQuestion = faqData.find(
      (faqItem) => faqItem.question.toLowerCase() === userQuery.toLowerCase()
    );
    if (matchingQuestion) {
      // If a matching question is found, display its corresponding answer
      setFaqResponse(matchingQuestion.answer);
    } else {
      // If no matching question is found, display a default message
      setFaqResponse("Sorry, we couldn't find an answer to your question.");
    }
    // Reset user input field
    setUserQuery("");
  };

  return (
    <div className="faq">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userQuery}
          onChange={handleUserInput}
          placeholder="Type your question here..."
        />
        <button type="submit">Ask</button>
      </form>
      <div className="faq-response">{faqResponse && <p>{faqResponse}</p>}</div>
    </div>
  );
};

export default FAQ;
