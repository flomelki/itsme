// Components
import React, { Component } from 'react';
import LoginBox from './LoginBox';
import ChatRoom from './ChatRoom';

// CSS classes
import './App.css';
import './bootstrap.css';

class App extends Component {
  constructor() {
    super();

    this.state = { loggedState: false };
  }

  render() {
    if (!this.state.loggedState) {

      return (
        <div className='container justify-content-md-center'>
          <div class="row justify-content-md-center">
            <LoginBox callback={(loggedState) => this.setLoggedState(loggedState)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(loggedState) => this.setLoggedState(loggedState)} />);
    }
  }

  setLoggedState(loggedState) {
    this.setState({ loggedState: loggedState })
  }

}

export default App;
