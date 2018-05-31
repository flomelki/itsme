// Components
import React, { Component } from 'react';
import _ from 'lodash';

// CSS classes
import './bootstrap.css';
import './ListMessages.css';

class ListMessages extends Component {
    propTypes: {
        messages: React.PropTypes.array,
        userId: React.propTypes.string
    };

    render() {
        if (this.props.messages.length > 0)
            return _.orderBy(this.props.messages, ['date'], ['desc']).map((el) =>
                <div key={el.key} style={{ 'display': 'flow-root' }}>
                    <div className={'msg ' + (el.userId.toString() === this.props.userId.toString() ? ' float-left' : ' float-right')} style={{ 'borderColor': 'darkgrey' }}>
                        <div className='msg-date'>{new Date(el.msgdt).toLocaleDateString()} {new Date(el.msgdt).toLocaleTimeString()}</div>
                        <div>{el.msg}</div>
                    </div>
                </div>
            );
        return null;
    }
}

export default ListMessages;
