import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './Admin';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById('root'));
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/admin" component={Admin} />
        </Switch>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
