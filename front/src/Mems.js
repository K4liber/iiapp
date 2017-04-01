import React from 'react';
import Comments from './Comments';
import Mem from './Mem';
import { hostName } from './App.js'
import { HttpClient } from './App.js'

var Mems = React.createClass({
  getInitialState: function() {
    return {
      mems: null
    }
  },
  componentDidMount: function() {
    let isLogged = false;
    if (this.props.category)
      isLogged = true;
    var client = new HttpClient(true);
    let url = hostName + "/mems";
    console.log(url);
    this.serverRequest = client.get(url, function(result) {
      this.setState({
        mems: result,
        isLogged: isLogged,
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
      let self = this;
      return (
        <div>
          {
            JSON.parse(this.state.mems).map( function(mem, index) {
              return (
                <Mem mem={mem} index={index}/>
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