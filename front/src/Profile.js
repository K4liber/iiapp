import React from 'react';
import Mems from './Mems';
import { HttpClient } from './App.js'
import { hostName } from './App.js'

var Profile = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
    }
  },
  componentDidMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/profile/' + res[2], function(result) {
      this.setState({
        mems: result,
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

export default Profile;