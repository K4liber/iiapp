import React from 'react';
import Mems from './Mems';
import Loading from './Loading';

import { hostName } from './App.js'
import { HttpClient } from './App.js'

var Home = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
      token: null,
    }
  },
  componentDidMount: function() {
    this.setState({
      memId: '1'
    });
  },
  componentWillReceiveProps : function(newProps) {
    this.setState({
      token: this.props.token,
    });
  },
  componentWillMount: function() {
    var client = new HttpClient(true);
    let url = hostName + "/mems";
    this.serverRequest = client.get(url, function(result) {
      this.setState({
        mems: result,
      });
    }.bind(this));
  },
  render: function() {
    if(this.state.mems) {
      return (
        <div className="row well well-sm">
          <div className="contentLeft col-md-12" id="contentLeft">
            <Mems mems={this.state.mems}/>
          </div>
        </div> 
      );
    } else {
      return (
        <Loading/>
      );
    }
  }
});

export default Home;