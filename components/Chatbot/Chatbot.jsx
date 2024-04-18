import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
    setSubmitted(true); // Set submitted to true when the form is submitted

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
    fetch("https://jsonplaceholder.typicode.com/posts", {
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
    // Check if the input is empty
    const isEmpty = event.target.value.trim() === "";
    // Update the isEmpty state
    setIsEmpty(isEmpty);
    // Use to check if input is being logged
    // console.log("Input value:", event.target.value);
    setQuestion(event.target.value);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

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
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default Chatbot;
