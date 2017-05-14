import React from 'react';

import { FacebookButton, FacebookCount } from "react-social";
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import {
  generateShareIcon
} from 'react-share';

import Comments from './Comments';

import { HttpClient } from './App.js';
import { hostName } from './App.js';
import { host } from './App.js';
import { lock } from './App.js';
import { AppID } from './App.js';
import { browserHistory } from './App.js';

import request from 'superagent';
const FacebookIcon = generateShareIcon('facebook');

const modalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  }
};

var MemPage = React.createClass({
  getInitialState: function() {
    return {
      mem: null,
      result: null,
      modalIsOpen: false,
    }
  },
  openModal: function () {
    this.setState({modalIsOpen: true});
  },
  closeModal: function () {
    this.setState({modalIsOpen: false});
  },
  componentWillMount: function() {
    var res = location.pathname.split("/"); 
    var client = new HttpClient(true);
    var url = hostName + '/mem/' + res[2]
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
      let profile = JSON.parse(localStorage.getItem('profile'));
      let upload = request.post(hostName + "/addMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.state.mem.ID)
        .field('authorNickname', profile.nickname)
        .field('userID', profile.user_id)
      upload.end((err, response) => {
        if (err) {
          console.log(err);
        }
        if (response.status === 200) {
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
      let profile = JSON.parse(localStorage.getItem('profile'));
      let upload = request.post(hostName + "/addMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.state.mem.ID)
        .field('authorNickname', profile.nickname)
        .field('userID', profile.user_id)
      upload.end((err, response) => {
        if (err) {
          console.log(err);
        }
        if (response.status === 200){
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
  deleteMem: function() {
    if(JSON.parse(localStorage.getItem('profile'))) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      let userID = profile.user_id;
      let upload = request.post(hostName + "/deleteMem")
          .field('Bearer ', localStorage.getItem('token'))
          .field('memID', this.state.mem.ID)
          .field('authorNickname', this.state.mem.AuthorNickname)
          .field('userID', userID)
        upload.end((err, response) => {
          if (err) {
            console.log(err);
          }
          if (response.status === 200 && response.text !== "false"){
            this.setState({
              mem: null,
            });
            browserHistory.replace('/profile/' + profile.nickname);
          }
        });
    }
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      let categoryTip = mem.Category + " category";
      let shareUrl = "visionaries.pl/idea/" + mem.ID;
      var picture = mem.AuthorPhoto;
      var date = new Date(Date.parse(mem.DateTime));
      var dateTime = date.toString();
      var isMain = false;
      if (localStorage.getItem('profile'))
          isMain = mem.AuthorNickname === JSON.parse(localStorage.getItem('profile')).nickname;
      return (
          <div className="row well well-sm">
            <div className="contentLeft col-md-12" id="contentLeft">
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeComments}
                style={modalStyle}
                contentLabel="Example Modal"
              >
                <div>
                  You really want to delete this idea and all comments, and points belong?
                </div>
                <div className="center">
                  <button onClick={this.deleteMem} className="btn btn-danger margin2">Delete</button>
                  <button onClick={this.closeModal} className="btn btn-primary red margin2">Cancel</button>
                </div>
              </Modal>
              <div className="mem">
                <div>
                  Uploaded by <span data-tip="check profile" onClick={() => this.showProfile(mem.AuthorNickname)}>{mem.AuthorNickname}</span> at {dateTime}
                </div>
                <div className="memImage">
                  <img className="memImage" alt="" src={host + "/resources/mems/" + mem.ID +mem.ImgExt}/>
                  <ReactTooltip />
                  <img data-tip={categoryTip} alt="" src={"/img/" + mem.Category + "Icon.png"} className="uploadLogoChoosen"/>
                  {isMain &&
                    <img data-tip="delete" alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.openModal}/>
                  }
                </div>
                <div className="memPageSignature">
                  {mem.Signature}
                </div>
                <div>
                  Views: {this.state.mem.Views}  | Points: {this.state.mem.Points} 
                  {!this.state.mem.Like && 
                    <img data-tip="add point" onClick={this.doLike} className="thumbImage" alt="" src="/img/thumbIcon.png"/>
                  }
                  {this.state.mem.Like && 
                    <img data-tip="delete point" onClick={this.doUnLike} className="thumbImage" alt="" src="/img/thumbDownIcon.png"/>
                  }| Shares: <FacebookCount  url={shareUrl}/>
                  <FacebookButton data-tip="share on facebook"  style={{ border: 0, backgroundColor: 'transparent' }} className="fbButton" url={shareUrl} appId={AppID} message={mem.Signature} media={host + "/resources/mems/" + mem.ID +mem.ImgExt}>
                    {
                      <FacebookIcon size={18} round={false} /> 
                    }
                  </FacebookButton>
                </div>
                <div>
                  <Comments memId={this.state.mem.ID} result={this.state.result} className="comments"/>
                </div>
              </div>
            </div>
          </div>
        );
      } else 
        return ( <div>Loading mems...</div> );
  }
});

export default MemPage;