import React from 'react';
import Mem from './Mem';

import { HttpClient } from './App.js';
import { hostName } from './App.js';

var Activity = React.createClass({
  getInitialState: function() {
    return {
      activity: null,
      showMem: false,
      mem: null,
    }
  },
  componentWillMount: function() {
      this.setState({
        activity: this.props.activity,
        showMem: false,
        mem: null,
      });
  },
  showMem: function() {
    if(!this.state.mem) {
      let client = new HttpClient(true);
      this.serverRequest = client.get(hostName + '/mem/' + this.state.activity.MemID, function(result) {
          this.setState({
              mem: JSON.parse(result).Mem,
              showMem: true,
          });
      }.bind(this));
    } else {
      this.setState({ 
          showMem: true,
      });
    }
  },
  hideMem: function() {
      this.setState({ 
          showMem: false,
      });
  },
  render: function() {
    let activity = this.state.activity;
    var date = new Date(Date.parse(activity.DateTime));
    var dateTime = date.toString();
    if (this.state.activity) {
      return (
        <div>
          <div>
            {activity.Description} | {dateTime}
            {!this.state.showMem &&
              <img onClick={this.showMem} className="thumbImage" alt="" src="/img/arrowDown.png"/>
            }
            {this.state.showMem &&
              <img onClick={this.hideMem} className="thumbImage" alt="" src="/img/arrowUp.png"/>
            }
          </div>
          {this.state.showMem &&
            <Mem mem={this.state.mem}/>
          }
        </div>
      );
    } else {
      return ( 
        <div>
          Loading...
        </div>
      );
    }
  }
});

export default Activity;