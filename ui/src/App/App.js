import React, { Component } from 'react';
import { APPS } from './App.consts';

import './App.css';

import ChatApp from '../ChatApp';
import TodoApp from '../TodoApp';
import SideBar from './SideBar';

class App extends Component {

  renderApp() {
    const { activeApp } = this.props;

    switch (activeApp) {
      case APPS.TODO:
        return <TodoApp />
      case APPS.CHAT:
      default:
        return <ChatApp />
    }
  }

  render() {
    const { setActiveApp } = this.props;

    return (
      <div className='app-container'>
        <SideBar setApp={setActiveApp} />
        {this.renderApp()}
      </div>
    );
  }
}

export default App;
