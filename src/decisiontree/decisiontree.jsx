import { ReactDOM, React } from "react";
// Sample decision tree structure
const decisionTree = {
  greeting: {
    options: ["hello", "hi", "hey"],
    responses: {
      hello: "Hello! How can I assist you today?",
      hi: "Hi there! How can I help?",
      hey: "Hey! What can I do for you?",
    },
    next: "main",
  },
  main: {
    options: ["issue", "help", "goodbye"],
    responses: {
      issue: "Could you please describe the issue you're facing?",
      help: "Sure, what do you need assistance with?",
      goodbye: "Goodbye! Feel free to reach out anytime.",
    },
    next: null, // End of conversation
  },
};

// Chatbot component
class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStage: "greeting", // Initial stage
      conversation: [],
    };
  }

  handleUserInput = (input) => {
    const { currentStage } = this.state;
    const stage = decisionTree[currentStage];
    const nextStage = stage.options.find((option) =>
      input.toLowerCase().includes(option)
    );
    const response = stage.responses[nextStage];

    if (nextStage) {
      this.setState((prevState) => ({
        currentStage: stage.next,
        conversation: [
          ...prevState.conversation,
          { sender: "user", message: input },
        ],
      }));

      setTimeout(() => {
        this.setState((prevState) => ({
          conversation: [
            ...prevState.conversation,
            { sender: "bot", message: response },
          ],
        }));
      }, 500);
    }
  };

  render() {
    return (
      <div>
        <div>
          {this.state.conversation.map((msg, index) => (
            <div key={index}>
              <p>
                {msg.sender === "user" ? "You: " : "Bot: "}
                {msg.message}
              </p>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              this.handleUserInput(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
    );
  }
}

// Usage
ReactDOM.render(<Chatbot />, document.getElementById("root"));
