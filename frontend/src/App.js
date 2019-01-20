import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

const socket = io('http://192.168.1.2:3001');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      textArea: ''
    }

    this.sendMessage = this.sendMessage.bind(this);

    socket.on('chat message', (msg) => this.setState((prevState) => ({ textArea: `${prevState.textArea}\n${msg}` })));
  }

  sendMessage(e) {
    e.preventDefault();

    socket.emit('chat message', this.state.message);

    this.setState({ message: '' });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.sendMessage}>
            <input
              type="text"
              placeholder="Send a message"
              onChange={(e) => this.setState({ message: e.target.value })}
              value={this.state.message}
            />
            <button type="submit" >Send</button>
          </form>
          <textarea value={this.state.textArea} readOnly rows={10} cols={30} />
        </header>
      </div>
    );
  }
}

export default App;
