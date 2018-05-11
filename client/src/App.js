import React, { Component } from 'react';
import LoginBox from './LoginBox';
import logo from './logo.svg';
import './App.css';
import './bootstrap.css';

class App extends Component {
  constructor()
  {
    super();

    this.state = { loggedState : false };

      // let ws = new WebSocket("ws://localhost:8066", "echo-protocol");
      // ws.onopen = function(even) 
      // {
      //   ws.send('init');
      // }


    }
    render() {
      if (!this.state.loggedState)
      {

        return (
          <LoginBox className='mx-auto' callback={(loggedState) => this.setLoggedState(loggedState) } />
          );
        }
        else
        {
          return (<h1>GG</h1>);
        }
      }

      setLoggedState(loggedState)
      {
        console.log(loggedState)
        this.setState({ loggedState : loggedState})
      }

    }

    export default App;
