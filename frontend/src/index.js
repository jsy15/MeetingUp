import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Our Components
import Login from './components/Login';
import CreateAcc from './components/CreateAccount';
import event from './components/Event';
import admin from './components/Admin';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/createaccount" component={CreateAcc} />
            <Route exact path="/event/:eventID" component={event} />
            <Route exact path="/admin" component={admin} />
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
