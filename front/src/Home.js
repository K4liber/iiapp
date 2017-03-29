import React from 'react';
import Mems from './Mems';

var Home = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
      memId: '1'
    }
  },
  componentDidMount: function() {
    this.setState({
      memId: '1'
    });
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
            <Mems/>
          </div>
          <div className="contentRight col-md-4" id="contentRight">
          </div>
        </div>  
      );
    }
  }
});

export default Home;