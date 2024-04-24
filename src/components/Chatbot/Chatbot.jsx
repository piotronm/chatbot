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
  Box,
  Typography,
} from "@mui/material";
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

    setTimeout(() => {
      axios
        .get("data5.txt", { Query: query })
        .then((response) => {
          const data = response.data;
          console.log("API response received:", data);
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
    }, 2000);
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
    const messageStyle = {
      alignSelf: isUser ? "flex-end" : "flex-start",
      marginBottom: "8px",
    };

    const bubbleStyle = {
      bgcolor: isUser ? "#2979FF" : "#F0F0F0",
      color: isUser ? "#ffffff" : "#000000",
      borderRadius: "10px",
      padding: "8px 12px",
      marginLeft: isUser ? "auto" : 0,
      marginRight: isUser ? 0 : "auto",
      overflowWrap: "break-word",
      maxWidth: "80%",
    };

    return (
      <ListItem ref={bottomRef} style={messageStyle}>
        <Box sx={bubbleStyle}>
          <Typography variant="body1" sx={{ fontWeight: isUser ? 500 : 400 }}>
            {message}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  const renderContent = () => {
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
                        <TableContainer
                          component={Paper}
                          sx={{
                            marginTop: "20px",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <Table aria-label="Insights table">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                {Object.keys(
                                  JSON.parse(entry.response.content)
                                ).map((key, i) => (
                                  <TableCell
                                    key={i}
                                    sx={{
                                      border: "1px solid rgba(0, 0, 0, 0.12)",
                                      fontWeight: "bold",
                                      color: "#333333",
                                    }}
                                  >
                                    {key.replace(/_/g, " ")}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* Transpose the data */}
                              {[...Array(2)].map((_, i) => (
                                <TableRow key={i}>
                                  {Object.values(
                                    JSON.parse(entry.response.content)
                                  ).map((value, j) => (
                                    <TableCell
                                      key={j}
                                      sx={{
                                        border: "1px solid rgba(0, 0, 0, 0.12)",
                                        padding: "8px",
                                        color: "#555555",
                                      }}
                                    >
                                      {value[i]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
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
        height: "calc(100vh - 20px)",
        width: "400px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "auto",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {renderContent()}
      </div>
      <div
        style={{
          borderTop: "1px solid #ccc",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <form
          onSubmit={handleQuestionSubmit}
          style={{ width: "100%", marginRight: "10px" }}
        >
          <TextField
            fullWidth
            id="standard-search"
            label="Enter Your Question Here"
            value={question}
            onChange={handleQuestionChange}
            type="text"
            variant="outlined"
            maxLength={250}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.45)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2979FF",
                },
              },
            }}
          />
        </form>
        {loading && <CircularProgress color="primary" />}
      </div>
      {error && (
        <Alert severity="error" style={{ margin: "10px 20px" }}>
          <AlertTitle>Error</AlertTitle>
          Failed to fetch data. Please try again later.
        </Alert>
      )}
      {submitted && isEmpty && (
        <Alert severity="warning" style={{ margin: "10px 20px" }}>
          <AlertTitle>Warning</AlertTitle>
          Please enter a question.
        </Alert>
      )}
    </div>
  );
};

export default Chatbot;
