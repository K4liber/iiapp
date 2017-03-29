import React from 'react';

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
  goHome : function() {
    this.props.browserHistory.push('/');
  },
  render: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return (
      <div className="menu right col-md-12">
        <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
        <img alt="" src="/img/sportIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/scienceIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/movieIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/peopleIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/politicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/musicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/economyIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/ownIcon.png" className="iconLogo left"/>
        <img alt="" onClick={this.showProfile} src={profile.picture} className="iconLogo right"/>
        <img alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.settings} src="/img/settingsIcon.png" className="iconLogo right"/>
        <img alt="" onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo right"/>
      </div>
      );
    } else {
      return (
      <div className="menu right col-md-12">
        <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
        <img alt="" src="/img/sportIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/scienceIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/movieIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/peopleIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/politicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/musicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/economyIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/ownIcon.png" className="iconLogo left"/>
        <img alt="" onClick={this.showLock} src="/img/loginIcon2.png" className="iconLogo right"/>
        <img alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo right"/>
      </div>
      );
    }
  }
});

export default Board;