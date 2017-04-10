import React from 'react';

import request from 'superagent';

import { HttpClient } from './App.js';
import { hostName } from './App.js';
import { lock } from './App.js';

var MemPage = React.createClass({
  getInitialState: function() {
    return {
      mem: null,
      points: null,
      views: null,
    }
  },
  addView: function() {
    let upload = request.post(hostName + "/addView")
      .field('memID', this.state.mem.ID)
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
  componentDidMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    var url = hostName + '/mem/' + res[2]
    this.serverRequest = client.get(url, function(result) {
      let mem = JSON.parse(result).Mem;
      this.setState({
        mem: mem,
        points: mem.Points,
        views: mem.Views,
      });
      this.addView();
    }.bind(this));
  },
  doLike : function() {
    if (localStorage.getItem('profile')) {
      let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
      let upload = request.post(hostName + "/addMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.state.mem.ID)
        .field('authorNickname', nickname)
      upload.end((err, response) => {
        if (err) {
          console.log(err);
        }
        if (response.status === 200 && response.text !== "false") {
          let mem = this.state.mem;
          mem.Like = true;
          this.setState({
            points: this.state.points+1,
            mem: mem,
          });
        }
      });
    } else {
      lock.show();
    }
  },
  doUnLike : function() {
    if (localStorage.getItem('profile')) {
      let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
      let upload = request.post(hostName + "/deleteMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.state.mem.ID)
        .field('authorNickname', nickname)
      upload.end((err, response) => {
        if (err) {
          console.log(err);
        }
        if (response.status === 200 && response.text !== "false"){
          let mem = this.state.mem;
          mem.Like = false;
          this.setState({
            points: this.state.points-1,
            mem: mem,
          });
        }
      });
    } else {
      lock.show();
    }
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <img className="memImage" alt="ASAS" src={hostName + "/resources/mems/" + mem.ID +mem.ImgExt}/>
              <div className="commentSignature" onClick={this.goToIdea}>
                {mem.Signature}
              </div>
              <p>
                {mem.AuthorNickname} | {mem.DateTime} | Views: {this.state.views}  | Points: {this.state.points} 
                {!this.state.mem.Like && 
                  <img onClick={this.doLike} className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                }
                {this.state.mem.Like && 
                  <img onClick={this.doUnLike} className="thumbImage" alt="" src="/img/thumbDownIcon.png"/>
                }
              </p>
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

export default MemPage;