import React, { Component } from 'react';
import './bootstrap.css';
import './LoginBox.css';
import Network from './lib/network.js';

class LoginBox extends Component {
  propTypes: {
    callback: React.PropTypes.func,
  };

  constructor() {
    super();
    this.state = { loginStatus: null, subscribeStatus: null, usernameOk: false, pwdOk: false, okForLogin: false };
  }

  handleLogin(res) {
    this.resetStatuses();
    if (res.status === 'ok') {
      this.props.callback(res.rawResponse.userid, res.rawResponse.token, res.rawResponse.color);
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

  handleUsernameFill()
  {
    let usernameOk = document.getElementById('username').value.length >= 3;
    this.setState({usernameOk: usernameOk, okForLogin: usernameOk && this.state.pwdOk } );
  }

  handlePasswordFill()
  {
    let pwdOk = document.getElementById('password').value.length >= 3;
    this.setState({pwdOk: pwdOk, okForLogin: pwdOk && this.state.usernameOk } );
  }

  render() {
    return (
      <div className='loginbox col-6' >
        <div className='row'><header className='col'><h4>Connectez-vous sur itsme!</h4></header></div>
        <div className='row'>
          <div className="input-group mb-3 col">
            <div className="input-group-prepend">
              <span className="input-group-text" id="username-addon">Username</span>
            </div>
            <input id='username' type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="username-addon" onKeyUp={() => this.handleUsernameFill() }></input>
          </div>
        </div>

        <div className='row'>
          <div className="input-group mb-3 col">
            <div className="input-group-prepend">
              <span className="input-group-text" id="password-addon">Password</span>
            </div>
            <input id='password' type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" onKeyUp={() => this.handlePasswordFill()}></input>
          </div>
        </div>

        <div className='row mx-auto'>
          <div className="btn-group col-md-12" role="group">
            <button type="button" disabled={!this.state.okForLogin} className="btn btn-secondary" onClick={() => { Network.getAsyncRequest(`http://localhost:8067/users/${document.getElementById('username').value}/${document.getElementById('password').value}`, (res) => this.handleLogin(res)) }}>Login</button>
            <button type="button" disabled={!this.state.okForLogin} className="btn btn-secondary" onClick={() => { Network.putAsyncRequest(`http://localhost:8067/users/`, JSON.stringify({ 'username': document.getElementById('username').value, 'pwd': document.getElementById('password').value }), (res) => this.handleSubscribe(res)) }}>Subscribe</button>
          </div>
        </div>
        <div className='row mx-auto'>
          <div className='col-md-12'>{this.state.loginStatus === 'nok' ? 'Loggin failed' : this.state.subscribeStatus === 'nok' ? 'Subscription failed' : this.state.subscribeStatus === 'ok' ? 'Subscription succeeded. Please now login' : ''}</div>
        </div>
      </div>
    );
  }
}

export default LoginBox;