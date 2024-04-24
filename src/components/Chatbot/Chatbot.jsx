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
