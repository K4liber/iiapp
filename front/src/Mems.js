import React from 'react';

var HttpClient = function(sendToken) {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true ); 
        if (sendToken && localStorage.getItem('token')) {
          anHttpRequest.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('token'));
        }       
        anHttpRequest.send( null );
    }
}

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
    this.serverRequest = client.get('http://localhost:8080/mems', function(result) {
      this.setState({
        mems: result,
        isLogged: isLogged,
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.mems) {
      return (
        <div>
          {
            JSON.parse(this.state.mems).map( function(s, index) { 
              return (
                <div className="mem" key={index}>
                  <img alt="ASAS" src={"/img/" + s.ID +s.ImgExt}/>
                  <p>{s.Signature}</p>
                </div>
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