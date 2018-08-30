import LoginBox from "./LoginBox";
import Network from './lib/network.js';
import sha1 from 'crypto-js/sha1';
const salt = 'wzf1tW?!';

class UserLoginBox extends LoginBox {
  constructor() {
    super();
    this.state.title = "Welcome in itsme !";
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

  login() {
    let password = sha1(sha1(document.getElementById('password').value).toString() + salt).toString();
    Network.getAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_USER_PORT}/users/${document.getElementById('username').value}/${password}`, (res) => this.handleLogin(res));
  }

  subscribe() {
    let password = sha1(sha1(document.getElementById('password').value).toString() + salt).toString();
    Network.putAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_USER_PORT}/users/`, JSON.stringify({ 'username': document.getElementById('username').value, 'pwd': password }), (res) => this.handleSubscribe(res));
  }

  loginDisable() {
    return !(this.state.usernameOk && this.state.pwdOk);
  }

  subscribeDisable() {
    return !(this.state.usernameOk && this.state.pwdOk);
  }
}

export default UserLoginBox;