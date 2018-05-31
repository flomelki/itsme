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

    this.state = { userId : null, username : null, token : null, userColor : null };
  }

  render() {
    if (!this.loggedState()) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <LoginBox callback={(userId, username, token, userColor) => this.setLoggedState(userId, username, token, userColor)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(userId, username, token) => this.setLoggedState(userId, username, token)} token={this.state.token} userId={this.state.userId} username={this.state.username} />);
    }
  }

  setLoggedState(userId, username, token, userColor) {

    this.setState({ userId : userId, username : username, token : token })
  }

  loggedState()
  {
    return this.state.userId !== null;
  }


}

export default App;
