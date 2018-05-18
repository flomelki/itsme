import React, { Component } from 'react';
import './ChatRoom.css';
import './bootstrap.css';
import ListMessages from './ListMessages';

class ChatRoom extends Component {
  propTypes: {
    callback: React.PropTypes.func,
    token: React.PropTypes.string
  };


  constructor() {
    super();

    this.state = { messages: [] };
    // let ws = new WebSocket("ws://localhost:8066", "echo-protocol");
    // ws.onopen = function(even) 
    // {
    //   ws.send('init');
    // }
  }

  handleLogin(res) {
    this.props.callback(res.rawResponse.token);
  }

  render() {
    console.log('rendering')
    return (
      <div id='chatroom'>
        <div id='messages' className='container.fluid'>
          <div id='talkcontent'><ListMessages messages={this.state.messages} /></div>
        </div>

        <div id='talk' className='row align-items-end'>
          <div className='container-fluid'>
            <div className="input-group mb-3 col-md-12">
              <input id='talkinput' type="text" className="form-control" placeholder="Talk there" aria-label="Talk there" aria-describedby="talkinput-addon"></input>
              <button type="button" className="btn btn-secondary" onClick={() => {
                let messages = this.state.messages;
                messages.push(`${document.getElementById('talkinput').value}`);
                this.setState({messages : messages});
              }} >Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default ChatRoom;
