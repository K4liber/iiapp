import React from 'react';
import Categories from './Categories';

import { hostName } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';

import ReactTooltip from 'react-tooltip'

var Board = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      showOptions: false,
    }
  },
  componentDidMount: function() {
    if(localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      if (profile) {
        this.setState({
          profile: profile,
          showOptions: false,
        });
      }
    }
  },
  showProfile: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    browserHistory.replace('/profile/' + profile.nickname, {profile: profile,});
  },
  showActivities: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    browserHistory.replace('/activities/' + profile.nickname, {profile: profile,});
  },
  settings: function() {
    browserHistory.push('/settings');
  },
  upload: function() {
    browserHistory.push('/upload');
  },
  logout : function(){
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    browserHistory.push('/');
  },
  about: function() {
    browserHistory.push('/about');
  },
  showLock : function() {
    lock.show();
  },
  showOptions : function() {
    this.setState({
      showOptions: true,
    });
  },
  hideOptions : function() {
    this.setState({
      showOptions: false,
    });
  },
  render: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      var picture = profile.picture;
      if (profile.user_metadata && profile.user_metadata.picture)
        picture = hostName + "/resources/avatars/" + profile.user_metadata.picture
      if(this.state.showOptions) {
        return (
        <div className="menu right col-md-12">
          <Categories/>
          <img data-tip="hide options" alt="" src="/img/arrowRight.png" onClick={this.hideOptions} className="iconLogo right"/>
          <img data-tip="logout" alt="" onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo right"/>
          <img data-tip="about" alt="" onClick={this.about} src="/img/infoIcon.png" className="iconLogo right"/>
          <img data-tip="upload" alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
          <img data-tip="your activities" alt="" onClick={this.showActivities} src="/img/galleryIcon.png" className="iconLogo right"/>
          <img data-tip="settings" alt="" onClick={this.settings} src="/img/settingsIcon.png" className="iconLogo right"/>
          <img data-tip="your ideas" alt="" onClick={this.showProfile} src={picture} className="iconLogo right"/>
          <ReactTooltip />
        </div>
        );
      }
      else {
        return (
          <div className="menu right col-md-12">
            <Categories/>
            <img data-tip="logout" alt="" onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo right"/>
            <img data-tip="show options" alt="" src="/img/arrowLeft.png" onClick={this.showOptions} className="iconLogo right"/>
            <ReactTooltip />
          </div>
        );
      }
    } else {
      return (
      <div className="menu right col-md-12">
        <Categories/>
        <img data-tip="login" alt="" onClick={this.showLock} src="/img/loginIcon2.png" className="iconLogo right"/>
        <img data-tip="upload" alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
        <img data-tip="about" alt="" onClick={this.about} src="/img/infoIcon.png" className="iconLogo right"/>
        <ReactTooltip />
      </div>
      );
    }
  }
});

export default Board;