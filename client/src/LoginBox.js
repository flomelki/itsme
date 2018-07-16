import React, { Component } from 'react';
import './bootstrap.css';
import './LoginBox.css';
import Network from './lib/network.js';
import sha1 from 'crypto-js/sha1';
const salt = 'wzf1tW?!';

class LoginBox extends Component {
  propTypes: {
    callback: React.PropTypes.func,
  };

  constructor() {
    super();
    this.state = { loginStatus: null, subscribeStatus: null, usernameOk: false, pwdOk: false };
  }

  handleLogin(res) {
    this.resetStatuses();
    if (res.status === 'ok') {
      this.props.callback(res.rawResponse.userid, document.getElementById('username').value, res.rawResponse.token, res.rawResponse.color);
    }
    else
      this.setState({ loginStatus: res.status });
  }

  handleSubscribe(res) {
    this.resetStatuses();
    this.setState({ subscribeStatus: res.status });
  }

  resetStatuses() {
    this.setState({ loginStatus: null, subscribeStatus: null });
  }

  handleFieldsFill() {
    let usernameOk = document.getElementById('username').value.length >= 3;
    let pwdOk = document.getElementById('password').value.length >= 3;
    this.setState({ usernameOk: usernameOk, pwdOk: pwdOk });
  }

  login() {
    let password = sha1(sha1(document.getElementById('password').value).toString()+salt).toString();
    Network.getAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_USER_PORT}/users/${document.getElementById('username').value}/${password}`, (res) => this.handleLogin(res));
  }

  subscribe() {
    let password = sha1(sha1(document.getElementById('password').value).toString()+salt).toString();
    Network.putAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_USER_PORT}/users/`, JSON.stringify({ 'username': document.getElementById('username').value, 'pwd': password }), (res) => this.handleSubscribe(res));
  }

  render() {
    return (
      <div className='loginbox col-md-6 col-12' >
        <div className='row'><header className='col'><h4>Connectez-vous sur itsme!</h4></header></div>
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
            <button id="btnLogin" type="button" disabled={!(this.state.usernameOk && this.state.pwdOk)} className="btn btn-secondary"
              onClick={() => { this.login(); }}
              onTouchStart={() => { this.login(); }}
              >Login</button>
            <button id="btnSubscribe" type="button" disabled={!(this.state.usernameOk && this.state.pwdOk)} className="btn btn-secondary"
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