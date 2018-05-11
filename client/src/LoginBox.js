import React, { Component } from 'react';
// import logo from './logo.svg';
import './bootstrap.css';
import './LoginBox.css';
// import './TinyBootstrap.css';
import Network from './lib/network.js';

class LoginBox extends Component {


  propTypes : {
    callback: React.PropTypes.func
  };


  constructor()
  {
    super();
  }

  componentDidMount() {
    // this.props.callback(true);
  }

  render() {
    return (
      <div className='col-md-offset-5 col-md-2 loginbox '>
      <div className='row'><header className='col-md-12'><h4>Connectez-vous sur itsme!</h4></header></div>
      <div className='row'>
      <div className="input-group mb-3 col-md-12">
      <div className="input-group-prepend">
      <span className="input-group-text" id="username-addon">Username</span>
      </div>
      <input id='username' type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="username-addon"></input>
      </div>

      <div className="input-group mb-3 col-md-12">
      <div className="input-group-prepend">
      <span className="input-group-text" id="password-addon">Password</span>
      </div>
      <input id='password' type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon"></input>
      </div>

      <div className='row mx-auto'>
      <div className="btn-group" role="group">
      <button type="button" className="btn btn-secondary" onClick={() => { Network.getAsyncRequest(`http://localhost:8067/users/${document.getElementById('username').value}/${document.getElementById('password').value}`, function(res) { console.log(res);} ) } }>Login</button>
      <button type="button" className="btn btn-secondary" onClick={() => { Network.putAsyncRequest(`http://localhost:8067/users/`, JSON.stringify({ 'username' : document.getElementById('username').value, 'pwd' : document.getElementById('password').value }), function(res) { console.log(res);} ) } }>Subscribe</button>
        </div>
        </div>
        </div>
        </div>
        );
    }
  }

  export default LoginBox;