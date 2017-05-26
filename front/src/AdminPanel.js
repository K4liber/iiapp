import React from 'react';
import Mems from './Mems';

import { hostName } from './App.js';
import { HttpClient } from './App.js';

import request from 'superagent';

var AdminPanel = React.createClass({
  getInitialState: function() {
    return {
      isAdmin: false,
    }
  },
  componentWillMount: function() {
    let profile = JSON.parse(localStorage.getItem("profile"));
    if(profile.nickname === "janbielecki94")
    this.setState({
      isAdmin: true,
    });
  },
  deleteMem: function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      let memID = document.getElementById("memID").value;
      let upload = request.post(hostName + "/adminDeleteMem")
          .field('Bearer ', localStorage.getItem('token'))
          .field('memID', memID)
          .field('authorNickname', profile.nickname)
          .field('userID', profile.user_id)
        upload.end((err, response) => {
          if (err) {
            console.log(err);
          }
          if (response.status === 200){
            alert(response.text);
          }
        });
    } 
  },
  deleteComment: function() {
    if (localStorage.getItem('profile')) {
        let profile = JSON.parse(localStorage.getItem('profile'));
        let nickname = profile.nickname;
        let commentID = document.getElementById("commentID").value;
        let upload = request.post(hostName + "/adminDeleteComment")
            .field('Bearer ', localStorage.getItem('token'))
            .field('commentID', commentID)
            .field('authorNickname', profile.nickname)
            .field('userID', profile.user_id)
        upload.end((err, response) => {
            if (err) {
            console.log(err);
            }
            if (response.status === 200){
              alert(response.text);
            }
        });
    } 
  },
  render: function() {
    if(this.state.isAdmin) {
      return (
        <div className="row">
          <div className="contentLeft col-md-12" id="contentLeft">
            Admin Panel
            <div>
              Mem ID: <input id="memID" type="number"></input><button onClick={this.deleteMem} className="btn btn-warning margin2">Delete MEM</button>
            </div>
            <div>
              Comment ID: <input id="commentID" type="number"></input><button onClick={this.deleteComment} className="btn btn-warning margin2">Delete Comment</button>
            </div>
          </div>
        </div> 
      );
    } else {
      return (
        <div className="row">
          <div className="contentLeft col-md-12" id="contentLeft">
            You are not an admin!
          </div>
        </div> 
      );
    }
  }
});

export default AdminPanel;