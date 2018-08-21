// Components
import React, { Component } from 'react';
import UserLoginBox from './UserLoginBox';
import ChatRoom from './ChatRoom';

// CSS classes
import './App.css';
import './bootstrap.css';

// var config = new Config('./config/config_development');

class App extends Component {
  constructor() {
    super();
    this.state = { userid : null, username : null, token : null, userColor : null };
  }

  render() {
    if (!this.loggedState()) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <UserLoginBox callback={(userid, username, token, userColor) => this.setLoggedState(userid, username, token, userColor)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(userid, username, token) => this.setLoggedState(userid, username, token)} token={this.state.token} userid={this.state.userid} username={this.state.username} />);
    }
  }

  setLoggedState(userid, username, token, userColor) {

    this.setState({ userid : userid, username : username, token : token })
  }

  loggedState()
  {
    return this.state.userid !== null;
  }
}

export default App;
