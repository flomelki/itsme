// Components
import React, { Component } from 'react';
import Network from './lib/network.js';

// CSS classes
import './bootstrap.css';


class AdminRoom extends Component {
    constructor() {
        super();
        this.state = { userList: [] };
    }

    componentDidMount() {
        this.refreshUsers();
    }

    refreshUsers() {
        Network.getAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ADMIN_USER_PORT}/admin`, (res) => this.getAllUsers(res));
    }

    getAllUsers(res) {
        if (res.rawResponse.status === 'ok')
            this.setState({ userList: res.rawResponse.users });
        else
            alert("There were an error during users loading");
    }

    handleChangeAuthorized(userid, currentAuthorized) {
        if (currentAuthorized === 0)
            Network.postAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ADMIN_USER_PORT}/admin/enable`,
                JSON.stringify({ userid: userid }),
                () => this.refreshUsers());
        else
            Network.postAsyncRequest(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_ADMIN_USER_PORT}/admin/disable`,
                JSON.stringify({ userid: userid }),
                () => this.refreshUsers());

    }

    render() {
        if (this.state.userList.length === 0)
            return (<div>LOADING</div>);
        else {
            let userList = this.state.userList.map((user) =>
                <tr key={user.userid}>
                    <td>{user.userid}</td>
                    <td>{user.username}</td>
                    <td><input type="checkbox" checked={user.authorized === 1} onChange={() => {
                        this.handleChangeAuthorized(user.userid, user.authorized);
                    }} ></input></td>
                </tr>);
            return (
                <div className="container">
                    <div className="row">
                        <section className="col-sm-6">
                            <table className="table">  <thead class="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Authorized</th>
                                </tr>
                            </thead><tbody>{userList}</tbody></table>
                        </section>
                    </div>
                </div>);
        }
    }

}

export default AdminRoom;
