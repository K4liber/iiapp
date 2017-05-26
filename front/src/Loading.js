import React from 'react';

var Loading = React.createClass({
  render: function() {
    
      return (
        <div className="row">
          <div className="contentLeft col-md-12" id="contentLeft">
            <div className="centering marginTop10">
              <p><img alt="" src="/img/loading.gif"/></p>
            </div>
          </div>
        </div> 
      );
    
  }
});

export default Loading;