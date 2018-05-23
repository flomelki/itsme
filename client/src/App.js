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

    this.state = { loggedState: false, userId : null, token : '', userColor : '' };
  }

  render() {
    if (!this.state.loggedState) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <LoginBox callback={(loggedState, userId, token, userColor) => this.setLoggedState(loggedState, userId, token, userColor)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(loggedState) => this.setLoggedState(loggedState)} token={this.state.token} userColor={this.state.userColor} userId={this.state.userId} />);
    }
  }

  setLoggedState(loggedState, userId, token, userColor) {
    this.setState({ loggedState: loggedState, userId : userId, token : token, userColor : userColor })
  }

}

export default App;
