import React, { Component } from 'react';
import LoginBox from './LoginBox';
import logo from './logo.svg';
import './App.css';
import './bootstrap.css';

class App extends Component {
  constructor()
  {
    super();

      // let ws = new WebSocket("ws://localhost:8066", "echo-protocol");
      // ws.onopen = function(even) 
      // {
      //   ws.send('init');
      // }


  }
  render() {
    return (
      <LoginBox className='mx-auto'></LoginBox>
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h1 className="App-title">Welcome to React</h1>
    //     </header>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //   </div>
    );
  }
}

export default App;
