import React, { useState } from "react";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuestionSubmit = (event) => {
    event.preventDefault();

    // Extract the query directly from the state
    const query = question.trim(); // Remove leading and trailing whitespace

    if (!query) {
      // If query is empty, return without making API call
      return;
    }

    // Set loading state to true to show the loading indicator
    setLoading(true);

    // Log the question being sent to the API
    console.log("Sending data to API:", query);

    // First attempt fetching data from primary API
    fetch("https:.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: query }),
    })
      .then((response) => {
        if (!response.ok) {
          // If primary API request fails, attempt fetching data from backup API
          throw new Error("Primary API request failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API response received:", data);
        // Set the response received from the primary API
        setResponse(data.question); // Extract the question from the response
        // Clear the input field
        setQuestion("");
        // Reset error state
        setError(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        // If primary API request fails, attempt fetching data from backup API
        console.log("Attempting backup API request...");
        fetch("/data.json") // Assuming data.json is in the public folder
          .then((response) => {
            if (!response.ok) {
              throw new Error("Backup API request failed");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Backup API response received:", data);
            // Set the response received from the backup API
            setResponse(data.body); // Using data.body as an example, you might need to adjust based on the response format
            // Clear the input field
            setQuestion("");
            // Reset error state
            setError(null);
          })
          .catch((error) => {
            console.error("Backup API Error:", error);
            setError(
              "Both primary and backup API requests failed. Please try again later."
            );
          });
      })
      .finally(() => {
        // Set loading state to false when the API request completes
        setLoading(false);
      });
  };

  const handleQuestionChange = (event) => {
    // Use to check if input is being logged
    // console.log("Input value:", event.target.value);
    setQuestion(event.target.value);
  };

  return (
    <div className="chatbot-container">
      <form className="chatbot-form" onSubmit={handleQuestionSubmit}>
        <input
          className="chatbot-input"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your question or query"
        />
        <button className="chatbot-submit" type="submit">
          Submit
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="chatbot-error">{error}</p>}
      {response && <p className="chatbot-response">{response}</p>}
    </div>
  );
};

export default Chatbot;
