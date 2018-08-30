// Components
import React, { Component } from 'react';
import AdminLoginBox from './AdminLoginBox';
import AdminRoom from './AdminRoom';

// CSS classes
import './bootstrap.css';

class Admin extends Component {
  constructor() {
    super();
    this.state = { adminid : null };
  }

  render() {
    if (!this.loggedState() && process.env.REACT_APP_DEBUG_MODE !== "true") {

      return (
        <div className='container justify-content-md-center'>
          <div className="row justify-content-md-center">
            <AdminLoginBox callback={(adminid) => this.setLoggedState(adminid)} />
          </div>
        </div>
      );
    }
    else
      return <AdminRoom></AdminRoom>
  }

  setLoggedState(adminid) {

    this.setState({ adminid : adminid });
  }

  loggedState()
  {
    return this.state.adminid !== null;
  }
}

export default Admin;
