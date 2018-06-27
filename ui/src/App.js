import React, { Component } from 'react';

import './App.css';
import APPS from './App.consts';

import ChatApp from './ChatApp';
import TodoApp from './TodoApp';
import SideBar from './SideBar';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      app: APPS.chat
    };
  }

  renderApp() {
    switch (this.state.app) {
      case APPS.todo:
        return <TodoApp />
      case APPS.chat:
      default:
        return <ChatApp />
    }
  }

  render() {
    return (
      <div className='app-container'>
        <SideBar />
        {this.renderApp()}
      </div>
    );
  }
}

export default App;
