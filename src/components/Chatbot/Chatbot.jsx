import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false); // State variable for input validation
  const [submitted, setSubmitted] = useState(false); // State variable to track form submission

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const query = question.trim();

    if (!query) {
      return;
    }

    setLoading(true);

    // Use Axios to fetch data from data.json
    axios
      .get("/data2.json")
      .then((response) => {
        const data = response.data;
        console.log("API response received:", data);

        // Process the type and format the content accordingly
        let formattedContent;
        if (data.type === "insight") {
          // Assuming content is JSON, you can parse and format it here
          formattedContent = data.content;
        } else {
          // If type is not 'insight', it's assumed to be 'jira'
          formattedContent = data.content;
        }

        // Set the formatted content to state
        setResponse(formattedContent);
        setError(null);
      })
      .catch((error) => {
        console.error("Backup API Error:", error);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleQuestionChange = (event) => {
    // Check if the input is empty
    const isEmpty = event.target.value.trim() === "";
    // Update the isEmpty state
    setIsEmpty(isEmpty);
    // Use to check if input is being logged
    // console.log("Input value:", event.target.value);
    setQuestion(event.target.value);
  };

  const CustomTable = ({ data }) => {
    // Check if data or data.content is undefined or null
    if (!data || !data.content) {
      return "No DATA is shown"; // Or render a message indicating no data
    }

    // Get the content object from the data
    const content = data.content;

    // Extract the keys and values from the content object
    const keys = Object.keys(content);
    const values = Object.values(content);

    return (
      <TableContainer component={Paper}>
        <Table aria-label="Insights table">
          <TableHead>
            <TableRow>
              {keys.map((key, index) => (
                <TableCell key={index}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render a row for each value object */}
            {values.map((valueObject, index) => (
              <TableRow key={index}>
                {/* Render a cell for each value in the value object */}
                {keys.map((key, index) => (
                  <TableCell key={index}>{valueObject[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
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
        {error && <p className="chatbot-response">{response}</p>}
        {submitted && isEmpty && (
          <p className="error-message">Please enter a question.</p>
        )}
        {console.log("Response:", response)}
        {console.log("Response Content:", response && response.content)}
        {console.log(
          "Object Entries:",
          response.content && Object.entries(response.content)
        )}
        {response && typeof response === "object" ? (
          // If response is an object (assumed to be JSON), render a table or any appropriate component
          <CustomTable data={response} />
        ) : (
          // If response is not an object (assumed to be text), render the text directly
          <p className="chatbot-response">{response}</p>
        )}
      </div>
      {/* Table component removed */}
    </div>
  );
};
export default Chatbot;
