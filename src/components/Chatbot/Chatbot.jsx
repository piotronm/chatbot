import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { Done } from "@mui/icons-material";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
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
      .get("/data.json")
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

  const renderContent = () => {
    if (!response || !response.content) {
      return <p>No data available</p>;
    }

    if (response.type === "jira") {
      return <p>{response.content}</p>;
    }

    // Render content as Material-UI table
    const content = response.content;
    const keys = Object.keys(content);
    const values = Object.values(content);

    return (
      <TableContainer component={Paper}>
        <Table aria-label="Insights table">
          <TableHead></TableHead>
          <TableBody>
            {keys.map((key, index) => (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  <List>
                    {Object.entries(values[index]).map(
                      ([innerKey, innerValue]) => (
                        <ListItem key={innerKey}>
                          <ListItemIcon>
                            <Done />
                          </ListItemIcon>
                          {innerValue}
                        </ListItem>
                      )
                    )}
                  </List>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <form onSubmit={handleQuestionSubmit}>
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
      {error && <p>{error}</p>}
      {submitted && isEmpty && <p>Please enter a question.</p>}
      {renderContent()}
    </div>
  );
};

export default Chatbot;
