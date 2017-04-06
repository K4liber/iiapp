import React from 'react';
import Categories from './Categories';
import { hostName } from './App.js';

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
    this.props.browserHistory.replace('/profile/' + profile.nickname, {profile: profile,});
  },
  showActivities: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    this.props.browserHistory.replace('/activities/' + profile.nickname, {profile: profile,});
  },
  settings: function() {
    this.props.browserHistory.push('/settings');
  },
  upload: function() {
    this.props.browserHistory.push('/upload');
  },
  logout : function(){
    this.props.browserHistory.push('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.replace('http://localhost:3000');
  },
  showLock : function() {
    this.props.lock.show();
  },
  render: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      var picture = profile.picture;
      if (profile.user_metadata && profile.user_metadata.picture)
        picture = hostName + "/resources/avatars/" + profile.user_metadata.picture
      return (
      <div className="menu right col-md-12">
        <Categories/>
        <img alt="" onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.showActivities} src="/img/galleryIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.settings} src="/img/settingsIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.showProfile} src={picture} className="iconLogo right"/>
      </div>
      );
    } else {
      return (
      <div className="menu right col-md-12">
        <Categories/>
        <img alt="" onClick={this.showLock} src="/img/loginIcon2.png" className="iconLogo right"/>
        <img alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
      </div>
      );
    }
  }
});

export default Board;