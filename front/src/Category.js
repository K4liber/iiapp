import React from 'react';
import Comments from './Comments';
import { hostName } from './App.js'
import { HttpClient } from './App.js'

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
  showComments: function(id) {
    document.getElementById(id).style.display = "inline";
  },
  closeComments : function(id) {
    document.getElementById(id).style.display = "none";
  },
  render: function() {
    if (this.state.mems && this.state.mems!=="null") {
      let self = this;
      return (
        <div className="row well well-sm">
          <div className="contentLeft col-md-12" id="contentLeft">
              {
                JSON.parse(this.state.mems).map( function(mem, index) {
                  return (
                    <div className="mem relative" key={index}>
                      <div id={mem.ID} className="contentLeft col-md-12 comments" >
                        <Comments memId={mem.ID} />
                        <img onClick={() => self.closeComments(mem.ID)} alt="" src="/img/xIcon.png" className="cancelUpload" />
                      </div>           
                      <img className="memImage" alt="ASAS" src={hostName + "/resources/mems/" + mem.ID +mem.ImgExt}
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