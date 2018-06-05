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
    userId: React.propTypes.string,
    username: React.propTypes.string,
  };

  constructor() {
    super();

    this.state = { messages: [] };
  }

  componentDidMount() {
    let _this = this;

    ws = new WebSocket("ws://localhost:8066", 'itsme-protocol');
    // ws.onopen = function (even) {
    // ws.send();
    // }

    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      if (data.userId !== undefined) {
        let messages = _this.state.messages;
        messages.push({ key: btoa(data.msgdt), msg: data.content, msgdt: data.msgdt, userId: data.userId, username: _this.props.username });
        _this.setState({ messages: messages });
      }
    }
  }

  handleLogin(res) {
    this.props.callback(res.rawResponse.token);
  }

  sendMessage() {
    Network.postAsyncRequest(`http://localhost:8068/tokens/`, JSON.stringify({ 'userid': this.props.userId, 'token': this.props.token }), (res) => {
      if (res.status === 'ok') {
        ws.send(JSON.stringify({ userId: this.props.userId, content: document.getElementById('talkinput').value, msgdt: Date.now() }));
        document.getElementById('talkinput').value = '';
      }
      else
        this.props.callback(null, null); // logout
    });
  }

  render() {
    let _this = this;

    return (
      <div id='chatroom'>
        <div id='messages' className='container'>
          <div id='talkcontent'><ListMessages messages={this.state.messages} userId={this.props.userId} username={this.props.username} /></div>
        </div>

        <div id='talk' className='row align-items-end'>
          <div className='container'>
            <div className="input-group mb-3 col-md-12">
              <textarea id='talkinput' type='text' className="form-control" placeholder="Talk there" aria-label="Talk there" aria-describedby="talkinput-addon"
                  onKeyPress={function(evt) {
                    if (evt.charCode === 13)  // 13 == 'enter' key
                    {
                      evt.preventDefault();
                      let v = document.getElementById('talkinput').value;
                      if (v.length > 0)
                      {
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
