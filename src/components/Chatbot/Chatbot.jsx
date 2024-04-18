import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("Response:", response);
  }, [response]);

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const query = question.trim();
    if (!query) {
      return;
    }
    setLoading(true);
    axios
      .get("/data.json") // Adjust the API endpoint as needed
      .then((response) => {
        const data = response.data;
        console.log("API response received:", data);
        setResponse(data);
        setError(null);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleQuestionChange = (event) => {
    const isEmpty = event.target.value.trim() === "";
    setIsEmpty(isEmpty);
    setQuestion(event.target.value);
  };

  return (
    <div>
      <form className="chatbot-form" onSubmit={handleQuestionSubmit}>
        <TextField
          id="standard-search"
          label="Enter Your Question Here"
          onChange={handleQuestionChange}
          type="text"
          variant="standard"
          maxLength={250}
          autoFocus
        />
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="chatbot-response">{error}</p>}
      {submitted && isEmpty && (
        <p className="error-message">Please enter a question.</p>
      )}
      {response && response.content ? (
        <div>
          {Object.entries(response.content).map(([key, value]) => (
            <div key={key}>
              <h3>{key}</h3>
              <ul>
                {Object.entries(value).map(([innerKey, innerValue]) => (
                  <li key={innerKey}>
                    {innerKey}: {innerValue}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="chatbot-response">No data available</p>
      )}
    </div>
  );
};

export default Chatbot;
