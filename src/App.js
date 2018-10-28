import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const username = prompt("What's your name?", "");

    const socket = new WebSocket(`ws://${window.location.host}/ws`);
    socket.addEventListener('message', this.receiveMessage);

    this.state = {
      username,
      inputText: "",
      messages: [],
      socket
    };
  }

  receiveMessage = (e) => {
    const message = JSON.parse(e.data);
    console.log(message);
    this.setState({ messages: [...this.state.messages, message] });
  }

  sendMessage = () => {
    const {username, inputText: message, socket} = this.state;
    const serialised = JSON.stringify({ username, message });
    console.log(`Sending: ${serialised}`);
    socket.send(serialised);
    console.log(socket);
    this.setState({ inputText: "" });
  };

  handleInputChange = ({currentTarget}) => {
    this.setState({ inputText: currentTarget.value });
  };

  render() {
    return (
      <div className="App">
        <div className="message-history">
          {this.state.messages.map(message => {
            return (
              <div className="message">
                <div className="username">{message.username}</div>
                <div>{message.message}</div>
              </div>
            );
          })}
        </div>
        <div className="chat-input">
          <input
            placeholder="Type your message here..."
            value={this.state.inputText}
            onChange={this.handleInputChange}
            onSubmit={this.sendMessage}
          />
          <button className="primary-button" onClick={this.sendMessage}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default App;
