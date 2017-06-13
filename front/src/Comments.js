import React from 'react';
import request from 'superagent';

import Comm from './Comm.js';
import Loading from './Loading.js';
import CommArea from './AddComment/CommArea';

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
            showExpressions: false,
            showPreview: false,
            comment: null,
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
    clearTextarean: function() {
        let textArea = document.getElementById("commentArea");
        textArea.value="";
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
    sendComment : function(images) {
        var previews = [];
        images.map(function(item, index) {
            console.log(item);
            previews.push(item.preview);
        });
        console.log(previews);
        let id = "commentArea";
        var comment = document.getElementById(id).value;
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
                                .field('images', images)
                                .field('previews', previews)
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
                        document.getElementById(id).value = "";
                        this.textAreaAdjust(id);
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
        if (this.state.comments) {
            let self = this;  
            return (
                <div className="comments center" id="comments">
                    {
                        (this.state.comments).map( function(comment, index) { 
                            let key = "comment" + comment.ID;
                            return (
                                <Comm key={key} comment={comment} index={index} update={self.updateComment} delete={self.deleteComment}/>
                            )
                        })
                    }
                    <CommArea onSend={this.sendComment}/>
                </div>
            )
        } else if (this.state.mem){
            return (
                <div>
                    <CommArea onSend={this.sendComment}/>
                </div>
            )
        } else {
            return (
                <Loading/>
            )
        }
    }
});

export default Comments;