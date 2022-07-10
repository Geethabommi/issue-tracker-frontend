import React, { Component } from 'react';
import './assets/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Projects from './Projects';
import Login from './Login';
import Issue from './Issue';
import Signup from './Signup';

const API_URL = process.env.REACT_APP_API_URL;

class App extends Component {
  render() {
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )?.userID;
    console.log(user);
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/login' component={Login} />
            <Route path='/projects' component={Projects} />
            <Route path='/issues' component={Issue} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
