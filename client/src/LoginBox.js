import React, { Component } from 'react';
import './bootstrap.css';
import './LoginBox.css';

class LoginBox extends Component {
  propTypes: {
    callback: React.PropTypes.func,
  };

  constructor() {
    super();
    this.state = { loginStatus: null, subscribeStatus: null, usernameOk: false, pwdOk: false, title : "Default" };
  }

  resetStatuses() {
    this.setState({ loginStatus: null, subscribeStatus: null });
  }

  handleFieldsFill() {
    let usernameOk = document.getElementById('username').value.length >= 3;
    let pwdOk = document.getElementById('password').value.length >= 3;
    this.setState({ usernameOk: usernameOk, pwdOk: pwdOk });
  }

  render() {
    return (
      <div className='loginbox col-md-6 col-12' >
        <title className='row'><header className='col'><h4 id="loginTitle">{this.state.title}</h4></header></title>
        <div className='row'>
          <div className="input-group mb-3 col">
            <div className="input-group-prepend">
              <span className="input-group-text" id="username-addon">Username</span>
            </div>
            <input id='username' type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="username-addon" onKeyUp={() => this.handleFieldsFill()}></input>
          </div>
        </div>

        <div className='row'>
          <div className="input-group mb-3 col">
            <div className="input-group-prepend">
              <span className="input-group-text" id="password-addon">Password</span>
            </div>
            <input id='password' type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" onKeyUp={() => this.handleFieldsFill()}></input>
          </div>
        </div>
        <div className='row mx-auto'>
          <div className="btn-group col-md-12" role="group">
            <button id="btnLogin" type="button" disabled={this.loginDisable()} className="btn btn-secondary"
              onClick={() => { this.login(); }}
              onTouchStart={() => { this.login(); }}
              >Login</button>
            <button id="btnSubscribe" type="button" disabled={this.subscribeDisable()} className="btn btn-secondary"
              onClick={() => { this.subscribe(); }}
              onTouchStart={() => { this.subscribe(); }}
              >Subscribe</button>
          </div>
        </div>
        <div className='row mx-auto'>
          <div className='col-md-12'>{this.state.loginStatus === 'nok' ? 'Login failed' : this.state.subscribeStatus === 'nok' ? 'Subscription failed' : this.state.subscribeStatus === 'ok' ? 'Subscription succeeded. Please now login' : ''}</div>
        </div>
      </div>
    );
  }
}



export default LoginBox;