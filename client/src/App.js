import React, { Component } from 'react';
import LoginBox from './LoginBox';
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
          <div className='row'>
          <div className='mx-auto'>
          <LoginBox callback={(loggedState) => this.setLoggedState(loggedState) } />
          </div>
          </div>
          );
        }
        else
        {
          return (<h1>TODO</h1>);
        }
      }

      setLoggedState(loggedState)
      {
        console.log(loggedState)
        this.setState({ loggedState : loggedState})
      }

    }

    export default App;
