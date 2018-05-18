// Components
import React, { Component } from 'react';

// CSS classes
import './bootstrap.css';

class ListMessages extends Component {
    propTypes: {
        messages: React.PropTypes.array,
    };

    render() {
        if (this.props.messages.length > 0)
            return this.props.messages.map((message) => <div>{message}</div>);
        return null;
    }
}

export default ListMessages;
