import LoginBox from "./LoginBox";
import Network from './lib/network.js';
import sha1 from 'crypto-js/sha1';
const salt = 'wzf1tW?!';

class AdminLoginBox extends LoginBox
{
    constructor()
    {
        super();
    }

    login() {
        let password = sha1(sha1(document.getElementById('password').value).toString()+salt).toString();
        Network.getAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_USER_PORT}/admin/${document.getElementById('username').value}/${password}`, (res) => this.handleLogin(res));
      }

    loginDisable()
    {
      return !(this.state.usernameOk && this.state.pwdOk);
    }
  
    subscribeDisable()
    {
      return true;
    }    
}

export default AdminLoginBox;