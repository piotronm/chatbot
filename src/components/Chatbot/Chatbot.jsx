import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Done } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [responseHistory, setResponseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("Response History:", responseHistory);
  }, [responseHistory]);

  const handleQuestionSubmit = (event) => {
    event.preventDefault();
    const query = question.trim();
    if (!query) {
      setIsEmpty(true);
      return;
    }
    setSubmitted(true);
    setLoading(true);

    // POST request
    console.log("Data sent to the server:", { Query: query });
    axios
      .get("data3.json", { Query: query })
      .then((response) => {
        const data = response.data;
        console.log("API response received:", data);
        setResponseHistory([
          ...responseHistory,
          { question: query, response: data },
        ]);
        setError(null);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
        setQuestion(""); // Clear input box
        setIsEmpty(false);
      });
  };

  const handleQuestionChange = (event) => {
    const isEmpty = event.target.value.trim() === "";
    setIsEmpty(isEmpty);
    setQuestion(event.target.value);
  };

  const renderChatMessage = (message, isUser) => {
    return (
      <ListItem
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          marginBottom: "8px",
        }}
      >
        <Box
          sx={{
            bgcolor: isUser ? "#2979FF" : "#F0F0F0",
            color: isUser ? "#FFFFFF" : "#000000",
            borderRadius: "10px",
            padding: "8px 12px",
            // Align user message to the right
            marginLeft: isUser ? "auto" : 0,
            marginRight: isUser ? 0 : "auto",
          }}
        >
          <Typography>{message}</Typography>
        </Box>
      </ListItem>
    );
  };

  const renderContent = () => {
    if (loading) {
      return null;
    }

    if (submitted && responseHistory.length === 0) {
      return <p>No data available</p>;
    }

    return (
      <List>
        {responseHistory.map((entry, index) => (
          <div key={index}>
            {renderChatMessage(entry.question, true)}
            {entry.response.type === "jira" ? (
              <ListItem
                style={{
                  alignSelf: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#F0F0F0",
                    color: "#000000",
                    borderRadius: "10px",
                    padding: "8px 12px",
                  }}
                >
                  {entry.response.content.split(".").map((sentence, i) => (
                    <Typography key={i}>{sentence.trim()}</Typography>
                  ))}
                </Box>
              </ListItem>
            ) : (
              <div>
                {renderChatMessage(entry.response.content, false)}
                {entry.response.type === "insight" && (
                  <div>
                    {renderChatMessage(
                      "Here is the Client Insight data:",
                      false
                    )}
                    <TableContainer component={Paper}>
                      <Table aria-label="Insights table">
                        <TableBody>
                          {Object.entries(entry.response.content).map(
                            ([key, value], i) => (
                              <TableRow key={i}>
                                <TableCell>{key}</TableCell>
                                <TableCell>
                                  <List>
                                    {Object.entries(value).map(
                                      ([innerKey, innerValue], j) => (
                                        <ListItem key={j}>
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
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </List>
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      {renderContent()}
      <Divider />
      <Box
        component="form"
        onSubmit={handleQuestionSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <TextField
          fullWidth
          id="standard-search"
          label="Enter Your Question Here"
          value={question}
          onChange={handleQuestionChange}
          type="text"
          variant="standard"
          maxLength={250}
        />
      </Box>
      {loading && <CircularProgress color="primary" />}
      {error && <p>{error}</p>}
      {submitted && isEmpty && <p>Please enter a question.</p>}
    </div>
  );
};

export default Chatbot;
