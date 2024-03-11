import React from 'react';

// Define your Chatbot component
class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStage: 'greeting', // Initial stage
      conversation: []
    };
  }

  handleUserInput = (input) => {
    const { currentStage } = this.state;
    const stage = decisionTree[currentStage];
    const nextStage = stage.options.find(option => input.toLowerCase().includes(option));
    let response;
  
    if (nextStage) {
      response = stage.responses[nextStage];
      if (stage.next) {
        // Move to the next stage if available
        this.setState(prevState => ({
          currentStage: stage.next,
          conversation: [...prevState.conversation, { sender: 'user', message: input }]
        }));
      } else {
        // End of conversation, clear input field and return
        this.setState(prevState => ({
          conversation: [...prevState.conversation, { sender: 'user', message: input }]
        }));
        return;
      }
    } else {
      response = stage.defaultResponse; // Use default response if no matching option found
    }
  
    setTimeout(() => {
      this.setState(prevState => ({
        conversation: [...prevState.conversation, { sender: 'bot', message: response }]
      }));
    }, 500);
  };
  

  render() {
    return (
      <div>
        <div>
          {this.state.conversation.map((msg, index) => (
            <div key={index}>
              <p>{msg.sender === 'user' ? 'You: ' : 'Bot: '}{msg.message}</p>
            </div>
          ))}
        </div>
        <input type="text" placeholder="Type your message..." onKeyPress={(e) => {
          if (e.key === 'Enter') {
            this.handleUserInput(e.target.value);
            e.target.value = '';
          }
        }} />
      </div>
    );
  }
}

// Define your decision tree structure here
const decisionTree = {
  greeting: {
    options: ['hello', 'hi', 'hey'],
    responses: {
      hello: "Hello! How can I assist you today?",
      hi: "Hi there! How can I help?",
      hey: "Hey! What can I do for you?"
    },
    defaultResponse: "I'm sorry, I didn't understand that. Could you please try again?",
    next: 'main'
  },
  main: {
    options: ['issue', 'help', 'goodbye'],
    responses: {
      issue: "Could you please describe the issue you're facing?",
      help: "Sure, what do you need assistance with?",
      goodbye: "Goodbye! Feel free to reach out anytime."
    },
    defaultResponse: "I'm not sure what you mean. Can you please provide more information?",
    next: null // End of conversation
  }
};

// Render the Chatbot component
function App() {
  return (
    <div className="App">
      <h1>My Chatbot App</h1>
      <Chatbot />
    </div>
  );
}

export default App;
