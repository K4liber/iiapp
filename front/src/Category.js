import React from 'react';
import { hostName } from './App.js'
import { HttpClient } from './App.js'
import Mem from './Mem';

var Category = React.createClass({
  getInitialState: function() {
    return {
      mems: null
    }
  },
  componentDidMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/category/' + res[2], function(result) {
      this.setState({
        mems: result,
      });
    }.bind(this));
  },
  componentWillReceiveProps : function(newProps) {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    this.serverRequest = client.get(hostName + '/category/' + res[2], function(result) {
      this.setState({
        mems: result,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems && this.state.mems!=="null") {
      let self = this;
      return (
        <div className="row well well-sm">
          <div className="contentLeft col-md-12" id="contentLeft">
              {
                JSON.parse(this.state.mems).map( function(mem, index) {
                  console.log(mem);
                  let like = mem.Like;
                  return (
                    <Mem mem={mem} index={index} key={mem.ID}/>
                  )
                })
              }
           </div>
        </div> 
      );
    } else if(this.state.mems==="null") {
      return ( 
        <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <p>There are any of mem in this category!</p>
            </div>
        </div>
      );
    } else {
      return ( 
        <div className="row well well-sm">
          <div className="contentLeft col-md-12" id="contentLeft">
            <p>Loading mems...</p>
          </div>
        </div>
      );
    }
  }
});

export default Category;

