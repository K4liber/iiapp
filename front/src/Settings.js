import React from 'react';

var Settings = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
    }
  },
  componentDidMount: function() {
    let profile = localStorage.getItem('profile');
    this.setState({
      profile: profile,
    });
  },
  render: function() {
    if (this.state.profile) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
                <p>{profile.nickname}</p>
                <div>
                  <img alt="" src={profile.picture} className=""/>
                </div>
            </div>
          </div>
        );
      } else 
        return ( <div>Loading settings...</div> );
  }
});

export default Settings;