import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Auth0Lock from 'auth0-lock';
import createBrowserHistory from 'history/createBrowserHistory';
import { Route, BrowserRouter } from 'react-router-dom';

var browserHistory = createBrowserHistory();
var CLIENT_ID = "ANOkwl33Ja5JX2ctrzF6FSXwhDbgiGU6";
var CLIENT_DOMAIN = "k4liber.eu.auth0.com";

var HttpClient = function(sendToken) {
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
        anHttpRequest.send( null );
    }
}

//Application
var App = React.createClass({
  componentWillMount: function() {
    this.setupAjax();
    this.createLock();
  },
  /* We will create the lock widget and pass it to sub-components */
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
        // Save token and profile locally
        localStorage.setItem('token', authResult.accessToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        // Update DOM
        self.setState({
          token: authResult.accessToken,
          profile: profile
        });
      }); 
    });
    }
  },
  /* We will ensure that any AJAX request to our Go API has the authorization
     header and passes the user JWT with the request */
  setupAjax: function() {
    /** 
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('token')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('token'));
        }
      }
    });
    */
  },
  render: function() {
    return (
      <BrowserRouter>
        <Route path="/">
          <Route path="" component={() => (<Home lock={this.lock} />)}>
          
          </Route>
        </Route>
      </BrowserRouter>
    );
  },
});

//Home Component route('/')
var Home = React.createClass({
  logout : function(){
    localStorage.removeItem('token');
    window.location.replace('http://localhost:3000');
  },
  profileClick: function() {
    if (this.state.isLogged)
      console.log("Pokazuje profil");
    else
      this.showLock();
  },
  showLock: function() {
    browserHistory.push('/login');
    this.props.lock.show();
  },
  getInitialState: function() {
    return {
      mems: null
    }
  },
  componentDidMount: function() {
    let isLogged = false;
    if (this.props.token)
      isLogged = true;
    var client = new HttpClient(true);
    this.serverRequest = client.get('http://localhost:8080/mems', function(result) {
      this.setState({
        mems: result,
        isLogged: isLogged,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      console.log(this.state.mems);
      return (
        <div>
          <div className="row categories">
            <div className="menu right col-md-8">
                <img src="/img/ball.png" className="iconLogo"/>
                <img src="/img/scienceIcon.png" className="iconLogo"/>
                <img src="/img/movieIcon.png" className="iconLogo"/>
                <img src="/img/peopleIcon.png" className="iconLogo"/>
                <img src="/img/politicIcon.png" className="iconLogo"/>
                <img src="/img/musicIcon.png" className="iconLogo"/>
                <img src="/img/economyIcon.png" className="iconLogo"/>
            </div>
            <Board lock={this.props.lock}/>
          </div>
          <div className="row well well-sm">
            <div className="contentLeft col-md-8" id="contentLeft">
              {
                JSON.parse(this.state.mems).map( function(s, index) { 
                  return (
                    <div className="mem" key={index}>
                      <img alt="ASAS" src={"/img/" + s.ID +s.ImgExt}/>
                      <p>{s.Signature}</p>
                    </div>
                  )
                })
              }
            </div>
            <div className="contentRight col-md-4" id="contentRight">
                
            </div>
          </div>
        </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

//Profile Component route('/profile/*')
var Profile = React.createClass({
  logout : function(){
    localStorage.removeItem('token');
    window.location.replace('http://localhost:3000');
  },
  profileClick: function() {
    if (this.state.isLogged)
      console.log("Pokazuje profil");
    else
      this.showLock();
  },
  showLock: function() {
    browserHistory.push('/login');
    this.props.lock.show();
  },
  getInitialState: function() {
    return {
      mems: null
    }
  },
  componentDidMount: function() {
    let isLogged = false;
    if (this.props.token)
      isLogged = true;
    var client = new HttpClient(true);
    this.serverRequest = client.get('http://localhost:8080/mems', function(result) {
      this.setState({
        mems: result,
        isLogged: isLogged,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      console.log(this.state.mems);
      return (
        <div>
          <div className="row categories">
            <div className="menu right col-md-8">
                <img src="/img/ball.png" className="iconLogo"/>
                <img src="/img/scienceIcon.png" className="iconLogo"/>
                <img src="/img/movieIcon.png" className="iconLogo"/>
                <img src="/img/peopleIcon.png" className="iconLogo"/>
                <img src="/img/politicIcon.png" className="iconLogo"/>
                <img src="/img/musicIcon.png" className="iconLogo"/>
                <img src="/img/economyIcon.png" className="iconLogo"/>
            </div>
            <Board lock={this.props.lock}/>
          </div>
          <div className="row well well-sm">
            <div className="contentLeft col-md-8" id="contentLeft">
              {
                JSON.parse(this.state.mems).map( function(s, index) { 
                  return (
                    <div className="mem" key={index}>
                      <img alt="ASAS" src={"/img/" + s.ID +s.ImgExt}/>
                      <p>{s.Signature}</p>
                    </div>
                  )
                })
              }
            </div>
            <div className="contentRight col-md-4" id="contentRight">
                Profile
            </div>
          </div>
        </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

// Board element - right-up menu
var Board = React.createClass({
  componentDidMount: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    if (profile) {
      this.setState({
        profile: profile,
      });
    }
  },
  showProfile: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    browserHistory.push('/profile/' + profile.nickname);
    console.log(localStorage.getItem('profile'));
  },
  settings: function() {
    browserHistory.push('/settings');
  },
  logout : function(){
    browserHistory.push('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.replace('http://localhost:3000');
  },
  showLock : function() {
    browserHistory.push('/login');
    this.props.lock.show();
  },
  render: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return (
      <div className="menu right col-md-4">
          <img onClick={this.showProfile} src={profile.picture} className="iconLogo"/>  
          <img onClick={this.settings} src="/img/settingsIcon.png" className="iconLogo"/>
          <img src="/img/polska.png" className="iconLogo"/>
          <img onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo"/>
      </div>
      );
    } else {
      return (
      <div className="menu right col-md-4">
          <img onClick={this.showLock} src="/img/loginIcon2.png" className="iconLogo"/>
          <img src="/img/polska.png" className="iconLogo"/>
      </div>
      );
    }
  }
});



/** 
ReactDOM.render((
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>
), document.getElementById('app'));


ReactDOM.render((
  <BrowserRouter>
    <Route path="/" component={App}>
      <Route path="/" component={App}/>
      <Route path="home" component={() => (<Home lock={this.lock} idToken={this.state.token} />)}/>
      <Route path="profile" component={Board}/>
    </Route>
  </BrowserRouter>
), document.getElementById('app'));
*/
export default App;
