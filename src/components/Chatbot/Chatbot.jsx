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
      .get("data3.json", { Query: query })
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

    if (
      (submitted && !response) ||
      (response && response.type === "insight" && !response.content)
    ) {
      return <p>No data available</p>;
    }

    if (response && response.type === "jira") {
      const sentences = response.content.split(".");
      const filteredSentences = sentences.filter(
        (sentence) => sentence.trim() !== ""
      );

      return (
        <div>
          {submitted && renderChatMessage(question, true)}
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
              {filteredSentences.map((sentence, index) => (
                <div key={index}>
                  <Typography>{sentence.trim()}</Typography>
                </div>
              ))}
            </Box>
          </ListItem>
        </div>
      );
    }

    if (response && response.type === "insight") {
      if (
        response.content ===
        "Sorry, I am not able to handle the query, please use filter or reach out assistant"
      ) {
        return (
          <div>
            {submitted && renderChatMessage(question, true)}
            {renderChatMessage(response.content, false)}
          </div>
        );
      } else {
        const content = JSON.parse(response.content);
        const keys = Object.keys(content);
        const values = Object.values(content);

        return (
          <div>
            {submitted && renderChatMessage(question, true)}
            {renderChatMessage("Here is the Client Insight data:", false)}
            <TableContainer component={Paper}>
              <Table aria-label="Insights table">
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
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <List>{renderContent()}</List>
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
          onChange={handleQuestionChange}
          type="text"
          variant="standard"
          maxLength={250}
        />
      </Box>
      {loading && <BeatLoader color="blue" />}
      {error && <p>{error}</p>}
      {submitted && isEmpty && <p>Please enter a question.</p>}
    </div>
  );
};

export default Chatbot;
