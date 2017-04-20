import React from 'react';
import Mem from './Mem';

var Mems = React.createClass({
  getInitialState: function() {
    return {
      mems: null,
    }
  },
  componentWillReceiveProps : function(newProps) {
    this.setState({
      mems: newProps.mems,
    });
  },
  componentWillMount: function() {
    this.setState({
      mems: this.props.mems,
    });  
  },
  render: function() {
    if (this.state.mems) {
      return (
        <div className="mems">
          {
            JSON.parse(this.state.mems).map( function(mem, index) {
              let key = "mem" + mem.ID;
              return (
                <Mem key={key} mem={mem}/>
              )
            })
          }
        </div>
      );
    } else {
      return ( 
        <div>
          <p>Loading ideas...</p>
        </div>
      );
    }
  }
});

export default Mems;