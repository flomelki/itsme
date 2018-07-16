// Components
import React, { Component } from 'react';
import _ from 'lodash';

// CSS classes
import './bootstrap.css';
import './ListMessages.css';

class ListMessages extends Component {
    propTypes: {
        messages: React.PropTypes.array,
        userid: React.propTypes.string,
        username: React.propTypes.string,
    };

    render() {
        if (this.props.messages.length > 0)
            return _.orderBy(this.props.messages, ['date'], ['desc']).map((el) =>
                <div key={el.key} style={{ 'display': 'flow-root' }}>
                    <div className={'msg ' + (el.userid.toString() === this.props.userid.toString() ? ' float-left' : ' float-right')} style={{ 'borderColor': 'darkgrey' }}>
                        <div className='msg-date'>{`${new Date(el.timestamp).toLocaleDateString()} ${new Date(el.timestamp).toLocaleTimeString()}`}<br/>{`${this.props.username} says:`}</div>
                        <div>{el.message}</div>
                    </div>
                </div>
            );
        return null;
    }
}

export default ListMessages;
