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
  loadActivities: function(activities, days) {
    var toReturn = [];
    activities.map( function(activity, index) {
      var date = new Date(Date.parse(activity.DateTime));
      var time = date.getTime();
      var now = Date.now();
      var difference = 1000*60*60*24*days;
      if (time > now - difference)
        toReturn.push(activity);
    });
    return toReturn;
  },
  componentDidMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/activities/' + res[2], function(result) {
      var allAcitivities = JSON.parse(result).sort(this.compare);
      this.setState({
        activities: this.loadActivities(allAcitivities, 7),
        allActivities: allAcitivities,
      });
    }.bind(this));
  },
  showAll: function() {

  },
  compare: function(a, b) {
   if (a.DateTime < b.DateTime)
      return 1
   if (a.DateTime > b.DateTime)
      return -1
   return 0
  },
  sortActivities: function() {
    let days = document.getElementById("days").value;
    var activities = this.loadActivities(this.state.allActivities, days);
    this.setState({
      activities: activities,
    })
  },
  render: function() {
    if (this.state.activities) {
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <div className="activitiesSignature">
                  Your last <input id="days" onChange={this.sortActivities} defaultValue="7" min="1" max="365" type="number" /> days activties:
              </div>
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
        return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <div className="activitiesSignature">
                  Your last <input id="days" onChange={this.sortActivities} defaultValue="7" min="1" max="365" type="number" /> days activties:
              </div>
              You do not have any acitivities on Visionaries yet.
            </div>
          </div>
        );
  }
});

export default Activities;