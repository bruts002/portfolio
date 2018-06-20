import React, { Component } from 'react';

import ChatApp from './ChatApp';
import TodoApp from './TodoApp';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: 'chat'
    };
  }

  renderApp() {
    switch (this.state.app) {
      case 'todo':
        return <TodoApp />
      case 'chat':
      default:
        return <ChatApp />
    }
  }

  render() {
    return (
      <div>
        Main
        {this.renderApp()}
      </div>
    );
  }
}

export default App;
