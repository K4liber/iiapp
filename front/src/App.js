import React from 'react';
import './App.css';
import Upload from './Upload';
import Board from './Board';
import Profile from './Profile';
import Activities from './Activities';
import Category from './Category';
import Settings from './Settings';
import AdminPanel from './AdminPanel';
import Home from './Home';
import About from './About';
import MemPage from './MemPage';
import Auth0Lock from 'auth0-lock';
import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Router } from 'react-router-dom';
import { Switch } from 'react-router';
import { request } from 'request';
import FacebookProvider, { Like } from 'react-facebook';

//export const hostName = "http://localhost:3000/app";
//export const apiHost = "http://localhost:3000/app";
export const hostName = "http://46.41.136.25:80/app";
export const host = "http://46.41.136.25:80";
export const apiHost = "http://46.41.136.25:80/app";
export var browserHistory = createBrowserHistory();
export var lock;
export var AppID = 1891449367779446;
export var CLIENT_ID = "ANOkwl33Ja5JX2ctrzF6FSXwhDbgiGU6";
export var CLIENT_DOMAIN = "k4liber.eu.auth0.com";
export var CLIENT_SECRET = "6I_oCVGgrCJ4bQz1AhoUuixbbIOL4BRSXmOyAackQAP37sMsyOfXig5AjG9jzkhQ";
export var API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFqZENNMFV5T0VNM00wRXdNVFZHUVVRMk56RkdOVGMyTkRZMk0wSXdRME00TkVVelFVUkVPUSJ9.eyJpc3MiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tLyIsInN1YiI6ImNyeTUwV0ZYNVJrSUlVbGY1aUdiRnFwQURqQ1g3UlRrQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tL2FwaS92Mi8iLCJleHAiOjE1MDAxNTIxMjYsImlhdCI6MTQ5MTUxMjEyNiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMifQ.oqheDADiW3ueJZhoP3LtODWqWYGsNEziRzHP6ASOhxzQATcREp4fqGXx2I2yNjYFSxRhPqKofYSeaMFsmgegvWvKmsonYbjhYDF8T0DIowSbE2beXmPb38puEZ3Ij4isLLQlp_1qAy7YGYvmrHJnnPcvhZGD7MB9o31Sw6vqK3jRG5KKfzT-PfqSsY2qjZRkmFtS2GjsmtGfs3UZy6RmDGH1RYnmwNRpYggrvTsLscVeW_KEUjbq68IB2Bv8Q3Wv7lzQ7AuPFFWXzNZJrx3MPDeMoGfALXjbo1lUonomoAMRV2fX1N-_JVYo2SFuhQBc9YN27vV7_DbhyPE99LL5Zg";


export var HttpClient = function(sendToken) {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true ); 
        if (sendToken && localStorage.getItem('token')) {
          anHttpRequest.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('token'));
        } 
        if (localStorage.getItem('profile')) { 
          let profile = JSON.parse(localStorage.getItem('profile'));
          if (sendToken && profile) {
            anHttpRequest.setRequestHeader('nickname', profile.nickname);
          }
        }
        anHttpRequest.send( null );
    }
}

var App = React.createClass({
  
  getInitialState: function() {
    return {
      token: null,
      profile: null,
    }
  },
  componentWillMount: function() {
    this.createLock();
  },
  setNick: function() {
      let profile = JSON.parse(localStorage.getItem('profile'));
      let url = 'https://' + CLIENT_DOMAIN + '/api/v2/users/' + profile.user_id;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_TOKEN ,
      }
      var payload = JSON.stringify(
        {
            "user_metadata": {
                "nick": profile.nickname,
            }
        }
      );
      var options = { 
        method: 'PATCH',
        url: url,
        headers: headers,
        body: payload,
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      });
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
      this.lock.on("authorization_error", function(error) {
        alert(error.error_description);
      });
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
          browserHistory.push("/");
        });   
      });
      lock = this.lock;
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
                  <Home token={this.state.token}/>
                </Route>
                <Route path="/profile/:user">
                  <Profile/>
                </Route>
                <Route path="/activities/:user">
                  <Activities/>
                </Route>
                <Route path="/idea/:id">
                  <MemPage/>
                </Route>
                <Route path="/category">
                  <Route path="/:category">
                    <Category/>
                  </Route>
                </Route>
                <Route path="/upload">
                  <Upload lock={this.lock} browserHistory={browserHistory}/>
                </Route>
                <Route path="/settings">
                  <Settings/>
                </Route>
                <Route path="/about">
                  <About/>
                </Route>
                <Route path="/admin">
                  <AdminPanel/>
                </Route>
              </Switch>
              <div className="footer">
                <FacebookProvider appId={'' + AppID}>
                  <Like href="https://www.facebook.com/visionariesDOTpl" colorScheme="dark" share />
                </FacebookProvider>
              </div>
            </div>
      </Router>
    );
  },
});

export default App;
