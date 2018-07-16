import React, { Component } from 'react';
import Network from './lib/network.js';
import ListMessages from './ListMessages';

import './ChatRoom.css';
import './bootstrap.css';
let ws = undefined;

class ChatRoom extends Component {
  propTypes: {
    callback: React.PropTypes.func,
    token: React.PropTypes.string,
    userid: React.propTypes.string,
    username: React.propTypes.string,
  };

  constructor() {
    super();

    this.state = { messages: [] };
  }

  componentDidMount() {
    let _this = this;

    ws = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_WS_PORT}`, 'itsme-protocol');

    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      if (data.userid !== undefined) {
        let messages = _this.state.messages;
        messages.push({ key: btoa(data.timestamp), message: data.message, timestamp: data.timestamp, userid: data.userid, username: data.username });
        _this.setState({ messages: messages });
      }
    }
  }

  handleLogin(res) {
    this.props.callback(res.rawResponse.token);
  }

  sendMessage() {
    Network.postAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_TOKEN_PORT}/tokens/`,
      JSON.stringify({ 'userid': this.props.userid, 'token': this.props.token }), (res) => {
        if (res.status === 'ok') {
          ws.send(JSON.stringify({ userid: this.props.userid, message: document.getElementById('talkinput').value, timestamp: Date.now() }));
          document.getElementById('talkinput').value = '';
        }
        else
          this.props.callback(null, null); // logout
      });
  }

  loadMessages() {
    let _this = this;
    let lasttimestamp = this.state.messages.length > 0 ? this.state.messages[this.state.messages.length-1].timestamp : 0;
    Network.getAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_MSG_PORT}/messages/10/${lasttimestamp}`, (res) => {
      if (res.rawResponse !== undefined && res.rawResponse.length > 0)
      {
        let messages = res.rawResponse.map(x => { return { key: btoa(x.timestamp), message: x.message, timestamp: x.timestamp, userid: x.userid, username: x.username } });
        messages = messages.concat(_this.state.messages);
        console.dir(messages)
        _this.setState({ messages: messages });
      }
    });
  }

  render() {
    let _this = this;

    return (
      <div id='chatroom'>
        <div id='messages' className='container'>
          <div id='talkcontent'><ListMessages messages={this.state.messages} userid={this.props.userid} username={this.props.username} /></div>
        </div>

        <div id='load' className='container'>
          <div className="row justify-content-md-center">
            <div id='loadbox' className="col-md-6 col-12 text-center"
              onClick={() => { this.loadMessages(); }}>
              Click there to load previous messages
            </div>
          </div>
        </div>

        <div id='talk' className='row align-items-end'>
          <div className='container'>
            <div className="input-group mb-3 col-12">
              <textarea id='talkinput' rows='1' type='text' className="form-control" placeholder="Talk there" aria-label="Talk there" aria-describedby="talkinput-addon"
                onKeyPress={function (evt) {
                  if (evt.charCode === 13)  // 13 == 'enter' key
                  {
                    evt.preventDefault();
                    let v = document.getElementById('talkinput').value;
                    if (v.length > 0) {
                      _this.sendMessage();
                    }
                  }
                }
                }></textarea>
              <button type="button" className="btn btn-secondary" onClick={() => { this.sendMessage(); }} >Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
