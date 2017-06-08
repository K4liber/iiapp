import React from 'react';
import request from 'superagent';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip'

import { hostName } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';

var Latex = require('react-latex');

const modalStyle = {
  overlay: {
    zIndex: '99',
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex: '99',
  }
};

var Comm = React.createClass({
    getInitialState: function() {
        return {
            comment: null,
            modalIsOpen: false,
            images: [],
            videos: [],
            youtube: [],
        }
    },
    openModal: function () {
        this.setState({modalIsOpen: true});
    },
    closeModal: function () {
        this.setState({modalIsOpen: false});
    },
    componentDidMount: function() {
        //img
        var m,
        urls = [], 
        str = this.props.comment.Content,
        rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }
        //sourve
        var m2,
        urls2 = [], 
        str2 = this.props.comment.Content,
        rex2 = /<source[^>]+src="?([^"\s]+)"?\s*\/>/g;
        while ( m2 = rex2.exec( str2 ) ) {
            urls2.push( m2[1] );
        }
        //iframe
        var m3,
        urls3 = [], 
        str3 = this.props.comment.Content,
        rex3 = /<iframe[^>]+src="?([^"\s]+)"?\s*\/>/g;

        while ( m3 = rex3.exec( str3 ) ) {
            urls3.push( m3[1] );
        }
        this.setState({
            comment: this.props.comment,
            images: urls,
            videos: urls2,
            youtube: urls3,
        });   
    },
    componentWillReceiveProps : function(newProps) { 
        var m,
        urls = [], 
        str = this.props.comment.Content,
        rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }
        this.setState({
            comment: this.props.comment,
            images: urls,
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
    editComment: function() {
        let commentAreaID = "commentArea";
        let textArea = document.getElementById(commentAreaID);
        textArea.value = this.state.comment.Content;
    },
    render : function () {
        var imageIndex=0;
        var videoIndex=0;
        var youtubeIndex=0;
        if (this.state.comment) {
            let comment = this.state.comment;
            var picture = comment.AuthorPhoto;
            var isMain = false;
            let self = this;
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
                        <div className="margin3">
                            <img data-tip="check profile" alt="" onClick={() => this.showProfile(comment.AuthorNickname)} src={picture} className="commentPhoto"/>
                            <span className="span" data-tip="check profile" onClick={() => this.showProfile(comment.AuthorNickname)} >{comment.AuthorNickname}</span> | {dateTime} | Points: {this.state.comment.Points}
                            {!this.state.comment.Like && 
                                <img data-tip="add point" onClick={this.doLike}
                                    className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                            }
                            {this.state.comment.Like && 
                                <img data-tip="delete point" onClick={this.doUnLike}
                                    className="thumbImage" alt="ASAS" src="/img/thumbDownIcon.png"/>
                            }
                            { isMain  &&
                                <p className="right">
                                    <img data-tip="edit comment" alt="" src="/img/spannerIcon.png" className="margin3 deleteComment" onClick={this.editComment}/>
                                    <img data-tip="delete comment" alt="" src="/img/xIcon.png" className="margin3 deleteComment" onClick={this.openModal}/>
                                </p>
                            }
                        </div>
                        <div className="comment">
                        {
                            this.state.comment.Content.split("<end>").map(function(item, index) {
                                var itemKey = "latex" + index;
                                //img title
                                var rexImg = /<title[^>]+value="?([^]+)?"\s*\/>/g;
                                var img = rexImg.exec(item);
                                if (img && img[1])
                                    imageIndex++;
                                
                                //video videotitle
                                var rexVideo = /<videotitle[^>]+value="?([^]+)?"\s*\/>/g;
                                var video = rexVideo.exec(item);
                                if (video && video[1])
                                    videoIndex++;

                                //youtube youtube
                                var rexYoutube = /<youtube[^>]+value="?([^]+)?"\s*\/>/g;
                                var youtube = rexYoutube.exec(item);
                                if (youtube && youtube[1])
                                    youtubeIndex++;
                                return (
                                    <div key={itemKey}>
                                        { (img && img[1] && self.state.images[imageIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                        <img alt="" src={self.state.images[imageIndex-1]}/>
                                                        <figcaption>
                                                            Fig. {imageIndex} {img[1]}
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { (video && video[1] && self.state.videos[videoIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                        <video width="320" height="240" controls>
                                                            <source src={self.state.videos[videoIndex-1]} type="video/mp4"/>
                                                        </video>
                                                        <figcaption>
                                                            Vid. {videoIndex} {video[1]}
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { (youtube && youtube[1] && self.state.youtube[youtubeIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                         <iframe width="420" height="315"
                                                            src={self.state.youtube[youtubeIndex-1]}>
                                                        </iframe> 
                                                        <figcaption>
                                                            <strong>YT. {youtubeIndex} {youtube[1]}</strong>
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { ( (!img || !img[1]) && (!video || !video[1])  && (!youtube || !youtube[1]) ) &&
                                            <span>
                                                <Latex>{item}</Latex>
                                                <br/>
                                            </span>
                                        }
                                    </div>
                                )
                            })
                        }
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