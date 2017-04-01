import React from 'react';
import Mems from './Mems';
import { HttpClient } from './App.js'

var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      mems: null,
    }
  },
  componentDidMount: function() {
    let profile = localStorage.getItem('profile');
    console.log(profile);
    var client = new HttpClient(true);
    this.serverRequest = client.get('http://10.17.2.143:300/mems', function(result) {
      this.setState({
        mems: result,
        profile: profile,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      //let profile = JSON.parse(localStorage.getItem('profile'));
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <Mems/>
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

export default Profile;