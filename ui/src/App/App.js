import React, { Component } from 'react';

import './App.css';

import SideBar from './SideBar';

class App extends Component {
  render() {
    const { setActiveApp, children } = this.props;

    return (
      <div className='app-container'>
        <SideBar setApp={setActiveApp} />
        <div>
          {children}
        </div>
      </div>
    );
  }
}

export default App;
