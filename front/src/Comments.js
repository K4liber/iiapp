import React from 'react';
import request from 'superagent';
import Comm from './Comm.js';

import { hostName } from './App.js';
import { host } from './App.js';
import { HttpClient } from './App.js';
import { browserHistory } from './App.js';
import { lock } from './App.js';

var Comments = React.createClass({
    getInitialState: function() {
        return {
            comments: null,
            mem: null,
            lastCommentAuthor: null,
        }
    },
    componentDidMount: function() {
        if(this.props.result) {
            let lastAuthor = null;
            let comments = this.props.result.Comments;
            if(comments[comments.length-1])
                lastAuthor = comments[comments.length-1].AuthorNickname;
            this.setState({
                comments: comments,
                mem: this.props.result.Mem,
                lastCommentAuthor: lastAuthor,
            });
        } else {
            let memId = this.props.memId;
            var client = new HttpClient(true);
            this.serverRequest = client.get(hostName + '/mem/' + memId, function(result) {
                let comments = JSON.parse(result).Comments;
                let lastAuthor = null;
                if(comments[comments.length-1])
                    lastAuthor = comments[comments.length-1].AuthorNickname;
                this.setState({
                    comments: comments,
                    mem: JSON.parse(result).Mem,
                    lastCommentAuthor: lastAuthor,
                });
            }.bind(this));
        }
    },
    textAreaAdjust: function(id) {
        let textArea = document.getElementById(id);
        textArea.style.height = "0px";
        textArea.style.height = (textArea.scrollHeight)+"px";
    },
    goToIdea: function() {
        browserHistory.push('/idea/' + this.props.memId);
    },
    updateComment: function(comment) {
        let comments = this.state.comments;
         for (var i in comments) {
            if (comments[i].ID === comment.ID) {
                comments[i] = comment;
                break; //Stop this loop, we found it!
            }
        }
        this.setState({
            comments: comments,
        });
        this.forceUpdate();
    },
    sendComment : function(id) {
        var comment = document.getElementById("commentArea" + id).value;
        if (comment !== "") {
            if(localStorage.getItem('profile')) {
                let profile = JSON.parse(localStorage.getItem('profile'));
                var profilePicture = profile.picture;
                if (profile.user_metadata && profile.user_metadata.picture)
                    profilePicture = host + "/resources/avatars/" + profile.user_metadata.picture;
                let upload = request.post(hostName + "/addComment")
                                .field('userID', profile.user_id)
                                .field('Bearer ', localStorage.getItem('token'))
                                .field('authorNickname', profile.nickname)
                                .field('profilePicture', profilePicture)
                                .field('memID', this.props.memId)
                                .field('comment', comment)
                upload.end((err, response) => {
                    if (err) {
                        console.error(err);
                    }
                    if (response.status === 200) {
                        let actualComments = this.state.comments;
                        actualComments.push(JSON.parse(response.text));
                        this.setState({
                            comments: actualComments
                        })
                        document.getElementById("commentArea" + id).value = "";
                    }
                });
                
            } else {
                lock.show();
            }
        } else {
            alert("Your comment cannot be empty.");
        }
    },
    deleteComment : function(ID) {
        let comments = this.state.comments;
         for (var i in comments) {
            if (comments[i].ID === ID) {
                comments.splice(i, 1)
                break; //Stop this loop, we found it!
            }
        }
        this.setState({
            comments: comments,
        });
        this.forceUpdate();
    },
    render : function () {
        let lastIsMine = false;
        if (JSON.parse(localStorage.getItem('profile'))) {
            lastIsMine = 
                this.state.lastCommentAuthor === JSON.parse(localStorage.getItem('profile')).nickname;
        }
        if (this.state.comments) {
            let commentAreaID = "commentArea" + this.state.mem.ID;
            let self = this;
            return (
                <div className="comments center">
                    {
                        (this.state.comments).map( function(comment, index) { 
                            let key = "comment" + comment.ID;
                            return (
                                <Comm editable={lastIsMine} key={key} comment={comment} index={index} update={self.updateComment} delete={self.deleteComment}/>
                            )
                        })
                    }
                    <div>
                        <textarea onChangeCapture={() => this.textAreaAdjust(commentAreaID)} className="commentTextarea" maxLength="1000" id={commentAreaID} onChange={this.loadDescription} placeholder="Your comment ..."></textarea> 
                    </div>
                    <p>
                        <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Send</button>
                    </p>
                </div>
            )
        } else if (this.state.mem){
            let commentAreaID = "commentArea" + this.state.mem.ID;
            return (
                <div>
                    <div className="block">
                        <textarea onChangeCapture={() => this.textAreaAdjust(commentAreaID)} className="commentTextarea" maxLength="1000" id={commentAreaID} onChange={this.loadDescription} placeholder="Your comment ..."></textarea> 
                    </div>
                    <p>
                        <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Send</button>
                    </p>
                </div>
            )
        } else {
            return (
                <div>
                    Loading ...
                </div>
            )
        }
    }
});

export default Comments;