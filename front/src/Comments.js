import React from 'react';
import request from 'superagent';

import Comm from './Comm.js';
import Loading from './Loading.js';
import CommArea from './CommArea';

import { hostName } from './App.js';
import { host } from './App.js';
import { HttpClient } from './App.js';
import { browserHistory } from './App.js';
import { lock } from './App.js';

var Latex = require('react-latex');

var Comments = React.createClass({
    getInitialState: function() {
        return {
            comments: null,
            mem: null,
            lastCommentAuthor: null,
            showExpressions: false,
            expressions:  this.loadExpressions(),
            showPreview: false,
            comment: null,
        }
    },
    loadExpressions: function() {
        var expressions = [
            '$ a_{1} $',
            '$ \\frac{a}{b} $',
            '$ \\overline{x}  $',
            '$ \\sqrt{x} $',
            '$ x^{y} $',
            '$ \\bar{a} $',
            '$ \\hat{a} $',
            '$ \\alpha $',
            '$ \\beta $',
            '$ \\gamma $',
            '$ \\delta $',
            '$ \\eta $',
            '$ \\theta $',
            '$ \\pi $',
            '$ \\Sigma $',
            '$ \\Psi $',
            '$ \\lim_{x \\rightarrow 0} $',
            '$ \\sum_{i=1}^{n} \\quad $',
            '$ \\int_{0}^{\\pi} \\quad $',
            '$ \\oplus $',
            '$ \\otimes $',
            '$ \\odot $',
            '$ \\neq $',
        ]
        return expressions;
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
    sendComment : function() {
        let id = "commentArea";
        var comment = document.getElementById(id).value;
        if (comment !== "") {
            if(localStorage.getItem('profile')) {
                let profile = JSON.parse(localStorage.getItem('profile'));
                var profilePicture = profile.picture;
                console.log(profile);
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
    addExpression : function(expression) {
        let id = "commentArea" + this.state.mem.ID;
        var el = document.getElementById(id)
        var start = el.selectionStart;
        var end = el.selectionEnd;
        var text = el.value;
        var before = text.substring(0, start);
        var after  = text.substring(end, text.length);
        el.value = before + expression + after;
        el.selectionStart = el.selectionEnd = start + expression.length;
        el.focus()

        this.textAreaAdjust(id);
    },
    showExpressions : function() {
        this.setState({
            showExpressions: true,
        });
    },
    hideExpressions : function() {
        this.setState({
            showExpressions: false,
        });
    },
    keyPressed : function(e) {
        e = e || window.event;
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 13) {
            this.addExpression("\\#");
        }
        return;
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
            let commentAreaID = "commentArea" + this.state.mem.ID;
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