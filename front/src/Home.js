import React from 'react';
import Mems from './Mems';

var Home = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
      memId: '1',
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
    console.log("state changed");
  },
  render: function() {
    if (1) {
      return (
        <div className="row well well-sm">
          <div className="contentLeft col-md-12" id="contentLeft">
            <Mems/>
          </div>
        </div> 
      );
    } else {
       return (
        <div className="row well well-sm">
          <div className="contentLeft col-md-8" id="contentLeft">
            <Mems token={this.state.token}/>
          </div>
          <div className="contentRight col-md-4" id="contentRight">
          </div>
        </div>  
      );
    }
  }
});

export default Home;