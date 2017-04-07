import React from 'react';
import Mems from './Mems';

import { hostName } from './App.js'
import { HttpClient } from './App.js'

var About = React.createClass({
  getInitialState: function() {
    return {
      info: null,
    }
  },
  render: function() {
    return (
      <div className="row well well-sm">
        <div className="contentLeft col-md-12" id="contentLeft">
          About
        </div>
      </div> 
    ); 
  }
});

export default About;