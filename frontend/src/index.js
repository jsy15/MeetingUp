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

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/createaccount" component={CreateAcc} />
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
