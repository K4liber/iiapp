import React from 'react';
import Activity from './Activity';

import { HttpClient } from './App.js';
import { hostName } from './App.js';

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
      var acitivities = JSON.parse(result).sort(this.compare);
      this.setState({
        activities: acitivities,
      });
    }.bind(this));
  },
  compare: function(a, b) {
   if (a.DateTime < b.DateTime)
      return 1
   if (a.DateTime > b.DateTime)
      return -1
   return 0
  },
  render: function() {
    if (this.state.activities) {
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              {
                this.state.activities.map( function(activity, index) {
                  let key= "activity" + index;
                  return (
                    <Activity key={key} activity={activity}/>
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