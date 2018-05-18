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

    this.state = { loggedState: false, token : '' };
  }

  render() {
    if (!this.state.loggedState) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <LoginBox callback={(loggedState, token) => this.setLoggedState(loggedState, token)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(loggedState) => this.setLoggedState(loggedState)} token={this.state.token} />);
    }
  }

  setLoggedState(loggedState) {
    this.setState({ loggedState: loggedState });
  }

  setLoggedState(loggedState, token) {
    this.setState({ loggedState: loggedState, token : token })
  }

}

export default App;
