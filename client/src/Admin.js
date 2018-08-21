// Components
import React, { Component } from 'react';
import AdminLoginBox from './AdminLoginBox';

// CSS classes
// import './Admin.css';
import './bootstrap.css';

// var config = new Config('./config/config_development');

class Admin extends Component {
  constructor() {
    super();
    this.state = { userid : null, username : null, token : null, userColor : null };
  }

  render() {
    if (!this.loggedState()) {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <AdminLoginBox callback={(userid, username, token, userColor) => this.setLoggedState(userid, username, token, userColor)} />
          </div>
        </div>
      );
    }
    else {
      <div>TODO</div>
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

export default Admin;
