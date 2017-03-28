import React from 'react';
import Comments from './Comments';

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
                <div className="mem relative" key={index}>
                  <div id={mem.ID} className="contentLeft col-md-12 comments" >
                    <Comments memId={mem.ID} />
                    <img onClick={() => self.closeComments(mem.ID)} alt="" src="/img/xIcon.png" className="cancelUpload" />
                  </div>           
                  <img className="memImage" alt="ASAS" src={"http://localhost:8080/resources/mems/" + mem.ID +mem.ImgExt}
                    onClick={() => self.showComments(mem.ID)}/>
                  <img alt="" src={"/img/" + mem.Category + "Icon.png"} className="uploadLogoChoosen"/>
                  <p>{mem.Signature}</p>
                  <p>
                    {mem.AuthorNickname} | {mem.DateTime} | Views: 0 | Points: 0 
                    <img className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                  </p>
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