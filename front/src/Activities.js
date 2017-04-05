import React from 'react';
import Mems from './Mems';
import { HttpClient } from './App.js'
import { hostName } from './App.js'

var Activities = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      mems: null,
    }
  },
  componentDidMount: function() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    console.log(profile);
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/profile/' + profile.nickname, function(result) {
      this.setState({
        mems: result,
        profile: profile,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <Mems mems={this.state.mems}/>
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

export default Activities;