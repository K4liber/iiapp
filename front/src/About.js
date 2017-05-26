import React from 'react';

import request from 'superagent';
import { FacebookButton, FacebookCount } from "react-social";
import ReactTooltip from 'react-tooltip'

import Comments from './Comments';
import Loading from './Loading';

import { HttpClient } from './App.js';
import { hostName } from './App.js';
import { host } from './App.js';
import { lock } from './App.js';
import { AppID } from './App.js';
import { browserHistory } from './App.js';

import {
  generateShareIcon
} from 'react-share';

const FacebookIcon = generateShareIcon('facebook');

var About = React.createClass({
  getInitialState: function() {
    return {
      mem: null,
      result: null,
    }
  },
  componentWillMount: function() {
    var client = new HttpClient(true);
    var url = hostName + '/mem/' + 3
    this.serverRequest = client.get(url, function(result) {
      let res = JSON.parse(result);
      this.setState({
        result: res,
        mem: res.Mem,
      });
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
          mem.Points = mem.Points+1;
          this.setState({
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
          mem.Points = mem.Points-1;
          this.setState({
            mem: mem,
          });
        }
      });
    } else {
      lock.show();
    }
  },
  showProfile: function(nickname) {
      browserHistory.replace('/profile/' + nickname);
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      let shareUrl = "visionaries.pl/about";
      var picture = mem.AuthorPhoto;
      var date = new Date(Date.parse(mem.DateTime));
      var dateTime = date.toString();
      return (
          <div className="row">
            <div className="contentLeft col-md-12" id="contentLeft">
              <div className="maginTop10">
                Uploaded by <span onClick={() => this.showProfile(mem.AuthorNickname)}>{mem.AuthorNickname}</span> at {dateTime}
              </div>
              <img className="memImage" alt="ASAS" src={host + "/resources/mems/" + mem.ID +mem.ImgExt}/>
              <div className="commentSignature" onClick={this.goToIdea}>
                {mem.Signature}
              </div>
              <div>
                Views: {this.state.mem.Views}  | Points: {this.state.mem.Points} 
                {!this.state.mem.Like && 
                  <img onClick={this.doLike} className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                }
                {this.state.mem.Like && 
                  <img onClick={this.doUnLike} className="thumbImage" alt="" src="/img/thumbDownIcon.png"/>
                }| Shares: <FacebookCount url={shareUrl}/>
                <ReactTooltip />
                <FacebookButton data-tip="share on facebook" className="fbButton"  style={{ border: 0, backgroundColor: 'transparent' }} url={shareUrl} appId={AppID} message={mem.Signature} media={host + "/resources/mems/" + mem.ID +mem.ImgExt}>
                  {
                  <div>
                    <FacebookIcon size={20} round={false} /> 
                  </div>
                  }
                </FacebookButton>
              </div>
              <div>
                <Comments memId={this.state.mem.ID} result={this.state.result} className="comments"/>
              </div>
            </div>
          </div>
        );
      } else 
        return ( <Loading/> );
  }
});

export default About;