import React from 'react';
import request from 'superagent';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip'

import { hostName } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';
import { HttpClient } from './App.js';

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

var Comm = React.createClass({
    getInitialState: function() {
        return {
            comment: null,
            modalIsOpen: false,
        }
    },
    openModal: function () {
    this.setState({modalIsOpen: true});
    },
    closeModal: function () {
        this.setState({modalIsOpen: false});
    },
    componentDidMount: function() {
        this.setState({
            comment: this.props.comment,
        });  
    },
    componentWillReceiveProps : function(newProps) {
        this.setState({
            comment: this.props.comment,
        });  
    },
    updateComment: function(comment) {
        this.props.update(comment);
    },
    doLike : function() {
        if (localStorage.getItem('profile')) {
            let profile = JSON.parse(localStorage.getItem('profile'));
            let comment = this.state.comment;
            let upload = request.post(hostName + "/addCommentPoint")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', comment.ID)
                .field('authorNickname', profile.nickname)
                .field('userID', profile.user_id)
                .field('memID', this.state.comment.MemID)
            upload.end((err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response.status === 200) {
                    this.setState({
                        comment: JSON.parse(response.text),
                    });
                    let comm = JSON.parse(response.text);
                    this.updateComment(comm);
                }
            });
        } else {
            lock.show();
        }
    },
    doUnLike : function() {
        if (localStorage.getItem('profile')) {
            let profile = JSON.parse(localStorage.getItem('profile'));
            let nickname = profile.nickname;
            let commentID = this.state.comment.ID;
            let upload = request.post(hostName + "/deleteCommentPoint")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', commentID)
                .field('authorNickname', profile.nickname)
                .field('userID', profile.user_id)
            upload.end((err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response.status === 200) {
                    this.setState({
                        comment: JSON.parse(response.text),
                    });
                    let comm = JSON.parse(response.text);
                    this.updateComment(comm);
                }
            });
        } else {
            lock.show();
        }
    },
    showProfile: function(nickname) {
        browserHistory.replace('/profile/' + nickname);
    },
    deleteComment: function() {
        if (localStorage.getItem('profile')) {
            let profile = JSON.parse(localStorage.getItem('profile'));
            let nickname = profile.nickname;
            let commentID = this.props.comment.ID;
            let upload = request.post(hostName + "/deleteComment")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', commentID)
                .field('authorNickname', profile.nickname)
                .field('userID', profile.user_id)
            upload.end((err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response.status === 200) {
                    this.deleteFromComments(this.state.comment.ID)
                }
            });
        } else {
            lock.show();
        }
    },
    deleteFromComments: function(ID) {
        this.props.delete(ID);
    },
    render : function () {
        if (this.state.comment) {
            let comment = this.state.comment;
            var picture = comment.AuthorPhoto;
            var isMain = false;
            var date = new Date(Date.parse(comment.DateTime));
            var dateTime = date.toString();
            if (localStorage.getItem('profile'))
                isMain = comment.AuthorNickname === JSON.parse(localStorage.getItem('profile')).nickname;
            return (
                <div className="center relative">
                    <ReactTooltip />
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
                        <button onClick={this.deleteComment} className="btn btn-danger margin2">Delete</button>
                        <button onClick={this.closeModal} className="btn btn-primary red margin2">Cancel</button>
                        </div>
                    </Modal>
                    <div onMouseEnter={this.showDetails} onMouseLeave={this.hideDetails}>
                        <div>
                            <img data-tip="check profile" alt="" onClick={() => this.showProfile(comment.AuthorNickname)} src={picture} className="commentPhoto"/>
                            <span data-tip="check profile" onClick={() => this.showProfile(comment.AuthorNickname)} >{comment.AuthorNickname}</span> | {dateTime} | Points: {this.state.comment.Points}
                            {!this.state.comment.Like && 
                                <img data-tip="add point" onClick={this.doLike}
                                    className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                            }
                            {this.state.comment.Like && 
                                <img data-tip="delete point" onClick={this.doUnLike}
                                    className="thumbImage" alt="ASAS" src="/img/thumbDownIcon.png"/>
                            }
                            {isMain &&
                                <img data-tip="delete" alt="" src="/img/xIcon.png" className="deleteComment right" onClick={this.openModal}/>
                            }
                        </div>
                        <div className="comment">
                            {comment.Content}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
});

export default Comm;