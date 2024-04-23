import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [responseHistory, setResponseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    console.log("Response History:", responseHistory);
    scrollToBottom();
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

    // Simulate API call delay
    setTimeout(() => {
      // Simulate API response
      axios
        .get("data5.txt", { Query: query }) //change to .post and correct api
        .then((response) => {
          const data = response.data;
          console.log("API response received:", data);
          // Append the new question and response to the existing responseHistory
          setResponseHistory((prevHistory) => [
            ...prevHistory,
            { question: query, response: data },
          ]);
          setError(null);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
          setQuestion("");
          setIsEmpty(false);
        });
    }, 2000); // Simulate a 2-second delay
  };

  const handleQuestionChange = (event) => {
    const isEmpty = event.target.value.trim() === "";
    setIsEmpty(isEmpty);
    setQuestion(event.target.value);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const renderChatMessage = (message, isUser) => {
    return (
      <ListItem
        ref={bottomRef}
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
            marginLeft: isUser ? "auto" : 0,
            marginRight: isUser ? 0 : "auto",
            overflowWrap: "break-word",
            maxWidth: "80%", // Set a maximum width for the chat bubble
          }}
        >
          <Typography>{message}</Typography>
        </Box>
      </ListItem>
    );
  };

  const renderContent = () => {
    if (submitted && responseHistory.length === 0) {
      return <p>No data available</p>;
    }

    return (
      <List>
        {responseHistory.map((entry, index) => (
          <div key={index}>
            {entry.response.type === "jira" &&
              renderChatMessage(entry.question, true)}
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
                {entry.response.type === "insight" && (
                  <div>
                    {entry.response.content ===
                      "Sorry, I am not able to handle the query, please use filter or reach out assistant" && (
                      <div>
                        {renderChatMessage(entry.question, true)}
                        {renderChatMessage(entry.response.content, false)}
                      </div>
                    )}
                    {entry.response.content !==
                      "Sorry, I am not able to handle the query, please use filter or reach out assistant" && (
                      <div>
                        {renderChatMessage(entry.question, true)}
                        {renderChatMessage(
                          "Here is the Client Insight data:",
                          false
                        )}
                        <TableContainer component={Paper}>
                          <Table aria-label="Insights table">
                            <TableHead>
                              <TableRow>
                                {Object.keys(
                                  JSON.parse(entry.response.content)
                                ).map((key, i) => (
                                  <TableCell key={i}>
                                    {key.replace(/_/g, " ")}{" "}
                                    {/* Replace underscores with spaces */}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                {Object.values(
                                  JSON.parse(entry.response.content)
                                ).map((value, i) => (
                                  <TableCell key={i}>
                                    <List>
                                      {Object.values(value).map(
                                        (innerValue, j) => (
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
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    )}
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
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "600px",
          margin: "auto",
          position: "relative", // Ensure positioning context
        }}
      >
        {/* Render chat history */}
        {renderContent()}

        {/* Form for submitting questions */}
        <Divider />
        <Box
          component="form"
          onSubmit={handleQuestionSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "20px",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            padding: "10px",
          }}
        >
          <TextField
            fullWidth
            id="standard-search"
            label="Enter Your Question Here"
            value={question}
            onChange={handleQuestionChange}
            type="text"
            variant="outlined" // Change variant to "outlined" for a more contrasting border
            maxLength={250}
            sx={{
              "& .MuiOutlinedInput-root": {
                // Target the root element of the outlined input
                "& fieldset": {
                  // Style the fieldset, which is the border
                  borderColor: "rgba(0, 0, 0, 0.23)", // Change border color
                },
                "&:hover fieldset": {
                  // Style the fieldset on hover
                  borderColor: "rgba(0, 0, 0, 0.45)", // Change border color on hover
                },
                "&.Mui-focused fieldset": {
                  // Style the fieldset when focused
                  borderColor: "#2979FF", // Change border color when focused
                },
              },
            }}
          />

          {loading && (
            <div style={{ marginLeft: "10px" }}>
              <CircularProgress color="primary" />
            </div>
          )}
        </Box>

        {/* Error and submission feedback */}
        {error && <p>{error}</p>}
        {submitted && isEmpty && <p>Please enter a question.</p>}
        {error && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            <AlertTitle>Error</AlertTitle>
            Failed to fetch data. Please try again later.
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default Chatbot;
