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
  Box,
  Avatar,
} from "@mui/material";
import { Done } from "@mui/icons-material";
import { BeatLoader } from "react-spinners";

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

    // POST request
    console.log("Data sent to the server:", { Query: query });
    axios
      .post("/data.json", { Query: query })
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

    // GET request
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
    if (
      (submitted && !response) ||
      (response && response.type === "insight" && !response.content) ||
      (response && response.type === "jira" && !response.content)
    ) {
      return <p>No data available</p>;
    }

    if (response && response.type === "jira") {
      return (
        <div>
          {submitted && (
            <ListItem>
              <ListItemIcon>
                <Avatar />
              </ListItemIcon>
              <span>{question}</span>
            </ListItem>
          )}
          <p>{response.content}</p>
        </div>
      );
    }

    const content = response && response.content;
    const keys = content ? Object.keys(content) : [];
    const values = content ? Object.values(content) : [];

    return (
      <div>
        {submitted && (
          <ListItem>
            <ListItemIcon>
              <Avatar />
            </ListItemIcon>
            <span>{question}</span>
          </ListItem>
        )}
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
      </div>
    );
  };

  return (
    <div>
      {renderContent()}
      <Box
        component="form"
        onSubmit={handleQuestionSubmit}
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <TextField
          id="standard-search"
          label="Enter Your Question Here"
          onChange={handleQuestionChange}
          type="text"
          variant="standard"
          maxLength={250}
          autoFocus
        />
      </Box>
      {loading && <BeatLoader color="blue" />}
      {error && <p>{error}</p>}
      {submitted && isEmpty && <p>Please enter a question.</p>}
    </div>
  );
};

export default Chatbot;
