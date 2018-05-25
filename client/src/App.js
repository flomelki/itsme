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

    this.state = { userId : null, token : null, userColor : null };
  }

  render() {
    if (!this.loggedState()) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <LoginBox callback={(userId, token, userColor) => this.setLoggedState(userId, token, userColor)} />
          </div>
        </div>
      );
    }
    else {
      return (<ChatRoom callback={(userId, token) => this.setLoggedState(userId, token)} token={this.state.token} userId={this.state.userId} />);
    }
  }

  setLoggedState(userId, token, userColor) {

    this.setState({ userId : userId, token : token })
  }

  loggedState()
  {
    return this.state.userId !== null;
  }


}

export default App;
