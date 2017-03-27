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
  render: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return (
      <div className="menu right col-md-4">
          <img alt="" onClick={this.showProfile} src={profile.picture} className="iconLogo"/>
          <img alt="" onClick={this.upload} src="/img/uploadIcon.png" className="iconLogo"/>
          <img alt="" onClick={this.settings} src="/img/settingsIcon.png" className="iconLogo"/>
          <img alt="" onClick={this.logout} src="/img/logoutIcon.png" className="iconLogo"/>
      </div>
      );
    } else {
      return (
      <div className="menu right col-md-4">
          <img alt="" onClick={this.showLock} src="/img/loginIcon2.png" className="iconLogo"/>
      </div>
      );
    }
  }
});

export default Board;