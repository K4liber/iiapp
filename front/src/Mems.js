import React from 'react';
import Mem from './Mem';
import { hostName } from './App.js'
import { HttpClient } from './App.js'

var Mems = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
      token: null,
    }
  },
  componentWillReceiveProps : function(newProps) {
    var client = new HttpClient(true);
    let url = hostName + "/mems";
    console.log(url);
    this.serverRequest = client.get(url, function(result) {
      this.setState({
        mems: result,
        token: this.props.token,
      });
    }.bind(this));
  },
  componentDidMount: function() {
    var client = new HttpClient(true);
    let url = hostName + "/mems";
    console.log(url);
    this.serverRequest = client.get(url, function(result) {
      this.setState({
        mems: result,
      });
    }.bind(this));
  },
  showComments: function(id) {
    document.getElementById(id).style.display = "inline";
  },
  closeComments : function(id) {
    document.getElementById(id).style.display = "none";
  },
  render: function() {
    if (this.state.mems) {
      return (
        <div>
          {
            JSON.parse(this.state.mems).map( function(mem, index) {
              let key = "mem" + mem.ID;
              return (
                <Mem key={key} mem={mem} index={index}/>
              )
            })
          }
        </div>
      );
    } else {
      return ( 
        <div>
          <p>Loading mems...</p>
        </div>
      );
    }
  }
});

export default Mems;