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
  Button,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import AlertTitle from "@mui/material/AlertTitle";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [responseHistory, setResponseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCommHubButtons, setShowCommHubButtons] = useState(false);
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

    if (
      query.toLowerCase().includes("show me comm hub") ||
      query.toLowerCase().includes("comm hub") ||
      query.toLowerCase().includes("bring me to comm hub") ||
      query.toLowerCase().includes("com hub") ||
      query.toLowerCase().includes("communication hub") ||
      query.toLowerCase().includes("bring me to communication hub") ||
      query.toLowerCase().includes("cew comm hub") ||
      query.toLowerCase().includes("hub") ||
      query.toLowerCase().includes("comm") ||
      query.toLowerCase().includes("show hub") ||
      query.toLowerCase().includes("show comm hub")
    ) {
      setShowCommHubButtons(true);
      setQuestion("");
      return;
    }

    setSubmitted(true);
    setLoading(true);

    setTimeout(() => {
      axios
        .get("Jira.txt", { Query: query })
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

  const handleYesButtonClick = () => {
    window.open("https://example.com/commhub", "_blank");
    setShowCommHubButtons(false); // Hide the CommHub buttons
  };
  const handleNoButtonClick = () => {
    setShowCommHubButtons(false); // Hide the CommHub buttons
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
  const CommHubButtons = ({ handleYesButtonClick, handleNoButtonClick }) => {
    const theme = useTheme();

    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="body1" style={{ marginBottom: 10 }}>
          Would you like to navigate to Comm Hub?
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          onClick={handleYesButtonClick}
        >
          YES
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.grey[700],
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.grey[800],
            },
          }}
          style={{ marginLeft: 10 }}
          onClick={handleNoButtonClick}
        >
          NO
        </Button>
      </div>
    );
  };

  const renderCommHubButtons = () => {
    return showCommHubButtons ? (
      <div
        style={{
          position: "absolute",
          bottom: "10px", // Adjust this value as needed
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: "100%",
        }}
      >
        <CommHubButtons
          handleYesButtonClick={handleYesButtonClick}
          handleNoButtonClick={handleNoButtonClick}
        />
      </div>
    ) : null;
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
                  {/* Splitting the content by lines and rendering each line with its index */}
                  {entry.response.content.split(".").map((sentence, i) => (
                    <Typography key={i}>
                      {i + 1}. {sentence.trim()}
                    </Typography>
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

  const renderInputBox = () => {
    return (
      !showCommHubButtons && (
        <form
          onSubmit={handleQuestionSubmit}
          style={{ flex: "1", marginRight: "10px", minWidth: 0 }}
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
      )
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
        position: "relative",
      }}
    >
      <div
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {renderContent()}
      </div>
      {renderCommHubButtons()}
      <div
        style={{
          borderTop: "1px solid #ccc",
          padding: "10px 20px",
          alignItems: "center",
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
          width: "100%",
          boxSizing: "border-box",
          display: showCommHubButtons ? "none" : "flex",
        }}
      >
        {renderInputBox()}
        <div style={{ minWidth: 0 }}>
          {loading && <CircularProgress color="primary" />}
        </div>
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
