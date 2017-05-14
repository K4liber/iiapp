import React from 'react';
import Comments from './Comments';

import { browserHistory } from './App.js';
import { hostName } from './App.js';
import { host } from './App.js';
import { lock } from './App.js';
import { AppID } from './App.js';

import request from 'superagent';
import { FacebookButton, FacebookCount } from "react-social";
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip'

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

const commentsStyle = {
  overlay : {
    position          : 'fixed',
    top               : '3%',
    left              : '3%',
    right             : '3%',
    bottom            : '3%',
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    overlfow: 'scroll',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    width: 'auto',
    margin: '0 0 0 0',
    padding: '0px',
    backgroundColor : 'rgba(248,248,248, 0.9)',
  }
};

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
      showComments: false,
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
      this.setState({
        mem: this.props.mem,
      });
  },
  componentWillReceiveProps : function(newProps) {
    this.setState({
        mem: this.props.mem,
      });
  },
  goToIdea: function() {
    browserHistory.push('/idea/' + this.state.mem.ID);
  },
  showComments: function() {
    let mem = this.state.mem;
    mem.Views = mem.Views+1;
    this.setState({
      showComments: true,
    });
  },
  closeComments : function() {
    this.setState({
      showComments: false,
    });
  },
  doLike : function() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      let upload = request.post(hostName + "/addMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.props.mem.ID)
        .field('authorNickname', profile.nickname)
        .field('userID', profile.user_id)
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
      let profile = JSON.parse(localStorage.getItem('profile'));
      let upload = request.post(hostName + "/deleteMemPoint")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.props.mem.ID)
        .field('authorNickname', profile.nickname)
        .field('userID', profile.user_id)
      upload.end((err, response) => {
        if (err) {
          alert(response.text);
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
  deleteMem: function() {
    let userID = JSON.parse(localStorage.getItem('profile')).user_id;
    let upload = request.post(hostName + "/deleteMem")
        .field('Bearer ', localStorage.getItem('token'))
        .field('memID', this.props.mem.ID)
        .field('authorNickname', this.props.mem.AuthorNickname)
        .field('userID', userID)
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
  },
  render: function() {
    if (this.state.mem) {
      let mem = this.state.mem;
      //let shareUrl = hostName + "/mem/" + mem.ID;
      let shareUrl = "visionaries.pl/idea/" + mem.ID;
      var picture = mem.AuthorPhoto;
      var isMain = false;
      let categoryTip = mem.Category + " category";
      let memImage = host + "/resources/mems/" + mem.ID +mem.ImgExt;
      if (localStorage.getItem('profile'))
          isMain = mem.AuthorNickname === JSON.parse(localStorage.getItem('profile')).nickname;
      return (
        <div className="mem" >
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
          <Modal
              isOpen={this.state.showComments}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeComments}
              animationType={"fade"}
              style={commentsStyle}
              transparent={true}
              contentLabel={"Comments"}
            >
                <div className="commentSignature" onClick={this.goToIdea}>
                    {mem.Signature}
                </div>
                <Comments memId={mem.ID} className="comments"/>
                <img onClick={this.closeComments} alt="" src="/img/xIcon.png" className="cancelUpload" />
          </Modal>
          <div className="memImage">
            <ReactTooltip />
            <img data-tip="check out comments" className="memImage pointer resize" alt="" src={memImage}
              onClick={this.showComments}/>
            <img data-tip={categoryTip} alt="" src={"/img/" + mem.Category + "Icon.png"} className="uploadLogoChoosen"/>
            {isMain &&
              <img data-tip="delete" alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.openModal}/>
            }
          </div>
          <div className="commentSignature" onClick={this.goToIdea}>
            {mem.Signature}
          </div>
          <div>
            Views: {this.state.mem.Views}  | Points: {this.state.mem.Points} 
            {!this.state.mem.Like && 
              <img data-tip="add point" onClick={this.doLike} className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
            }
            {this.state.mem.Like && 
              <img data-tip="delete point" onClick={this.doUnLike} className="thumbImage" alt="" src="/img/thumbDownIcon.png"/>
            }| Shares: <FacebookCount  url={shareUrl}/>
            <FacebookButton data-tip="share on facebook" className="fbButton" style={{ border: 0, backgroundColor: 'transparent' }} url={shareUrl} appId={AppID} message={mem.Signature} media={memImage}>
              {
                <FacebookIcon size={18} round={false} /> 
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