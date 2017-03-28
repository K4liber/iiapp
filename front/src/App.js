import React from 'react';
import './App.css';
import Upload from './Upload';
import Categories from './Categories';
import Board from './Board';
import Profile from './Profile';
import Settings from './Settings';
import Home from './Home';
import Auth0Lock from 'auth0-lock';
import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Router } from 'react-router-dom';
import { Switch } from 'react-router';

var browserHistory = createBrowserHistory();
var CLIENT_ID = "ANOkwl33Ja5JX2ctrzF6FSXwhDbgiGU6";
var CLIENT_DOMAIN = "k4liber.eu.auth0.com";

var App = React.createClass({
  componentWillMount: function() {
    this.createLock();
  },
  createLock: function() {
    let self = this;
    let token = localStorage.getItem('token');
    let profile = localStorage.getItem('profile');
    if (token && profile) {
      self.setState({
        token: token,
        profile: profile
      });
    } else {
      this.lock = new Auth0Lock(CLIENT_ID, CLIENT_DOMAIN);
      this.lock.on("authenticated", function(authResult) {
        this.getUserInfo(authResult.accessToken, function(error, profile) {
          if (error) {
              alert("ERROR");
            return;
          }
          localStorage.setItem('token', authResult.accessToken);
          localStorage.setItem('profile', JSON.stringify(profile));
          // Update DOM
          self.setState({
            token: authResult.accessToken,
            profile: profile,
          });
        });   
      });
    }
  },
  render: function() {
    return (
      <Router history={browserHistory}>
            <div>
              <div className="row categories">
                <Board lock={this.lock} browserHistory={browserHistory}/>
              </div>
              <Switch>
                <Route exact path="/" >
                  <Home/>
                </Route>
                <Route path="/profile/:user">
                  <Profile/>
                </Route>
                <Route path="/upload">
                  <Upload/>
                </Route>
                <Route path="/settings">
                  <Settings/>
                </Route>
              </Switch>
            </div>
      </Router>
    );
  },
});

export default App;
