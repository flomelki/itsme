// Components
import React, { Component } from 'react';
import _ from 'lodash';

// CSS classes
import './bootstrap.css';

class ListMessages extends Component {
    propTypes: {
        messages: React.PropTypes.array,
    };

    render() {
        if (this.props.messages.length > 0)
            return _.orderBy(this.props.messages, ['date'], ['desc']).map((el) => <div>{el.msg}</div>);
        return null;
    }
}

export default ListMessages;
