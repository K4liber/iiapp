import React from 'react';
import Comments from './Comments';
import { hostName } from './App.js'
import { HttpClient } from './App.js'
import request from 'superagent';

var Mem = React.createClass({
  getInitialState: function() {
    return {
      mem: null,
      index: null,
      points: null,
      views: null,
    }
  },
  componentDidMount: function() {
      this.setState({
        mem: this.props.mem,
        index: this.props.index,
        points: this.props.mem.Points,
        views: this.props.mem.Views,
      });
  },
  componentWillReceiveProps : function(newProps) {
    this.setState({
        mem: this.props.mem,
        index: this.props.index,
        points: this.props.mem.Points,
        views: this.props.mem.Views,
      });
  },
  showComments: function(id) {
    document.getElementById(id).style.display = "inline";
    let upload = request.post(hostName + "/addView")
      .field('Bearer ', localStorage.getItem('token'))
      .field('memID', id)
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.status === 200)
        this.setState({
          views: this.state.views+1,
        });
    });
  },
  closeComments : function(id) {
    document.getElementById(id).style.display = "none";
  },
  doLike : function() {
    let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
    let upload = request.post(hostName + "/addMemPoint")
      .field('Bearer ', localStorage.getItem('token'))
      .field('memID', this.props.mem.ID)
      .field('authorNickname', nickname)
    upload.end((err, response) => {
      if (err) {
        console.log(err);
      }
      if (response.status === 200 && response.text !== "false")
        this.setState({
          points: this.props.mem.Points+1,
        });
    });
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      let index = this.state.index;
      let like = this.state.mem.Like;
      return (
        <div className="mem relative" >
          <div id={mem.ID} className="contentLeft col-md-12 comments" >
            <Comments memId={mem.ID} />
            <img onClick={() => this.closeComments(mem.ID)} alt="" src="/img/xIcon.png" className="cancelUpload" />
          </div>           
          <img className="memImage" alt="ASAS" src={hostName + "/resources/mems/" + mem.ID +mem.ImgExt}
            onClick={() => this.showComments(mem.ID)}/>
          <img alt="" src={"/img/" + mem.Category + "Icon.png"} className="uploadLogoChoosen"/>
          <p>{mem.Signature}</p>
          <p>
            {mem.AuthorNickname} | {mem.DateTime} | Views: {this.state.views}  | Points: {this.state.points} 
            {!like && 
              <img onClick={this.doLike} className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
            }
          </p>
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

export default Mem;