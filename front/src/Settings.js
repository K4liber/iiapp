import React from 'react';

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

var Settings = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
    }
  },
  componentDidMount: function() {
    let profile = localStorage.getItem('profile');
    console.log(profile);
    var client = new HttpClient(true);
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