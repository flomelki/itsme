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
  };

  constructor() {
    super();

    this.state = { messages: [] };
  }

  componentDidMount() {
    let _this = this;

    ws = new WebSocket("ws://localhost:8066", 'itsme-protocol');
    ws.onopen = function (even) {
      // ws.send();
    }

    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      console.dir(event)
      if (data.userId !== undefined) {
        let messages = _this.state.messages;
        messages.push({ key: btoa(data.msgdt), msg: data.content, msgdt: data.msgdt, userId: data.userId, username: 'data.username' });
        _this.setState({ messages: messages });
      }
    }
  }

  handleLogin(res) {
    this.props.callback(res.rawResponse.token);
  }

  render() {
    return (
      <div id='chatroom'>
        <div id='messages' className='container'>
          <div id='talkcontent'><ListMessages messages={this.state.messages} userId={this.props.userId} /></div>
        </div>

        <div id='talk' className='row align-items-end'>
          <div className='container'>
            <div className="input-group mb-3 col-md-12">
              <input id='talkinput' type="text" className="form-control" placeholder="Talk there" aria-label="Talk there" aria-describedby="talkinput-addon"></input>
              <button type="button" className="btn btn-secondary" onClick={() => {
                Network.postAsyncRequest(`http://localhost:8068/tokens/`, JSON.stringify({ 'userid': this.props.userId, 'token': this.props.token }), (res) => {
                  if (res.status === 'ok') {
                    ws.send(JSON.stringify({ userId: this.props.userId, content: document.getElementById('talkinput').value, msgdt: Date.now() }));
                    document.getElementById('talkinput').value = '';
                  }
                  else
                    this.props.callback(null, null); // logout
                });

              }} >Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default ChatRoom;
