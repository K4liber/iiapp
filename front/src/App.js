import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Upload from './Upload';
import MemDescription from './MemDescription';
import Auth0Lock from 'auth0-lock';
import createBrowserHistory from 'history/createBrowserHistory';
import { Route, Router } from 'react-router-dom';
import { Link, Switch } from 'react-router';

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
  render: function() {
    return (
      <Router history={browserHistory}>
            <div>
              <div className="row categories">
                <Categories/>
                <Board lock={this.props.lock} />
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
              </Switch>
            </div>
      </Router>
    );
  },
});

var Categories = React.createClass({
  goHome : function() {
    browserHistory.push('/');
  },
  render : function() {
    return (
      <div className="menu right col-md-8">
        <img src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo"/>
        <img src="/img/ball.png" className="iconLogo"/>
        <img src="/img/scienceIcon.png" className="iconLogo"/>
        <img src="/img/movieIcon.png" className="iconLogo"/>
        <img src="/img/peopleIcon.png" className="iconLogo"/>
        <img src="/img/politicIcon.png" className="iconLogo"/>
        <img src="/img/musicIcon.png" className="iconLogo"/>
        <img src="/img/economyIcon.png" className="iconLogo"/>
      </div>
    )
  }
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
      mems: null,
      memId: null
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
        memId: '1'
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      console.log(this.state.mems);
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-8" id="contentLeft">
              <Mems/>
            </div>
            <div className="contentRight col-md-4" id="contentRight">
              <MemDescription memId={this.state.memId} />
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

//Mems Component
var Mems = React.createClass({
  getInitialState: function() {
    return {
      mems: null
    }
  },
  componentDidMount: function() {
    let isLogged = false;
    if (this.props.category)
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
      return (
        <div>
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
      );
    } else {
      return ( 
        <div>
          <p>Loading mems...</p>
        </div>
      );
    }
  }
});

//Profile Component route('/profile/*')
var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      mems: null,
    }
  },
  componentDidMount: function() {
    let profile = localStorage.getItem('profile');
    var client = new HttpClient(true);
    this.serverRequest = client.get('http://localhost:8080/mems', function(result) {
      this.setState({
        mems: result,
        profile: profile,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      console.log(profile);
      console.log("Tralala");
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-8" id="contentLeft">
              <Mems/>
            </div>
            <div className="contentRight col-md-4" id="contentRight">
                <p>{profile.nickname}</p>
                <div>
                  <img src={profile.picture} className=""/>
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
    //browserHistory.push('/profile/' + profile.nickname);
    console.log(localStorage.getItem('profile'));
    browserHistory.replace('/profile/' + profile.nickname, {profile: profile,});
  },
  settings: function() {
    browserHistory.push('/settings');
  },
  upload: function() {
    browserHistory.push('/upload');
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
          <img onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo"/>
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
