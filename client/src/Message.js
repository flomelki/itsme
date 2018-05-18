// Components
import React, { Component } from 'react';

// CSS classes
import './Message.css';
import './bootstrap.css';

class Message extends Component {
  constructor() {
    super();

    console.log('creating')
  }

  render() {
      console.log(`rendering ${this.props.message}`)
    return <div>{this.props.message}</div>
  }
}

export default Message;
