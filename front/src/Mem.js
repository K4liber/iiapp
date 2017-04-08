import React from 'react';
import Comments from './Comments';

import { browserHistory } from './App.js';
import { hostName } from './App.js';
import { lock } from './App.js';
import { AppID } from './App.js';

import request from 'superagent';
import { FacebookButton, FacebookCount } from "react-social";

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const FacebookIcon = generateShareIcon('facebook');

var Mem = React.createClass({
  getInitialState: function() {
    return {
      mem: null,
      points: null,
      views: null,
      showComments: false,
    }
  },
  componentWillMount: function() {
      this.setState({
        mem: this.props.mem,
        points: this.props.mem.Points,
        views: this.props.mem.Views,
      });
  },
  componentWillReceiveProps : function(newProps) {
    this.setState({
        mem: this.props.mem,
        points: this.props.mem.Points,
        views: this.props.mem.Views,
      });
  },
  goToIdea: function() {
    browserHistory.replace('/idea/' + this.state.mem.ID);
  },
  showComments: function() {
    this.setState({
      views: this.state.views+1,
      showComments: true,
    });
  },
  closeComments : function(id) {
    this.setState({
      showComments: false,
    });
  },
  doLike : function() {
    if (localStorage.getItem('profile')) {
      let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
      let upload = request.post(hostName + "/addMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.props.mem.ID)
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
        .field('memID', this.props.mem.ID)
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
  deleteMem: function() {
    if (confirm("You really want to delete this idea and all comments and points belong?")) {
      let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
      let upload = request.post(hostName + "/deleteMem")
          .field('Bearer ', localStorage.getItem('token'))
          .field('memID', this.props.mem.ID)
          .field('authorNickname', this.props.mem.AuthorNickname)
          .field('nickname', nickname)
        upload.end((err, response) => {
          if (err) {
            console.log(err);
          }
          if (response.status === 200 && response.text !== "false"){
            this.setState({
              mem: null,
            });
          }
        });
    }
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      //let shareUrl = hostName + "/mem/" + mem.ID;
      let shareUrl = "90minut.pl";
      var isMain = false;
      let memImage = hostName + "/resources/mems/" + mem.ID +mem.ImgExt;
      if (localStorage.getItem('profile'))
          isMain = mem.AuthorNickname === JSON.parse(localStorage.getItem('profile')).nickname;
      return (
        <div className="mem relative" >
          {this.state.showComments &&
            <div className="contentLeft col-md-12 comments" >
              <Comments memId={mem.ID} />
              <img onClick={this.closeComments} alt="" src="/img/xIcon.png" className="cancelUpload" />
            </div>  
          }         
          <img className="memImage pointer" alt="ASAS" src={memImage}
            onClick={this.showComments}/>
          <img alt="" src={"/img/" + mem.Category + "Icon.png"} className="uploadLogoChoosen"/>
          {isMain &&
            <img alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.deleteMem}/>
          }
          <div className="commentSignature" onClick={this.goToIdea}>
            {mem.Signature}
          </div>
          <div>
            {mem.AuthorNickname} | {mem.DateTime} |  
          </div>
          <div>
            Views: {this.state.views}  | Points: {this.state.points} 
            {!this.state.mem.Like && 
              <img onClick={this.doLike} className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
            }
            {this.state.mem.Like && 
              <img onClick={this.doUnLike} className="thumbImage" alt="" src="/img/thumbDownIcon.png"/>
            }| Shares: <FacebookCount/>
            <FacebookButton url={shareUrl} appId={AppID} message={mem.Signature} media={"http://img.90minut.pl/img/reklama90/logo_zlote.gif"}>
              {
              <div>
                <FacebookIcon size={20} round={false} /> 
              </div>
              }
            </FacebookButton>
          </div>
        </div>
      );
    } else {
      return ( 
        <div>
         
        </div>
      );
    }
  }
});

export default Mem;