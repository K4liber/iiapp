import React from 'react';
import Mems from './Mems';
import { HttpClient } from './App.js'
import { hostName } from './App.js'

var Activities = React.createClass({
  getInitialState: function() {
    return {
      activities: null,
    }
  },
  componentDidMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/activities/' + res[2], function(result) {
      this.setState({
        activities: result,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.activities) {
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              {
                JSON.parse(this.state.activities).map( function(activity, index) {
                  return (
                    <div>
                      {activity.Description}
                    </div>
                  )
                })
              }
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

export default Activities;