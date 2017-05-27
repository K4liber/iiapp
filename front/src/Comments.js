import React from 'react';
import request from 'superagent';

import Comm from './Comm.js';
import Loading from './Loading.js';

import { hostName } from './App.js';
import { host } from './App.js';
import { HttpClient } from './App.js';
import { browserHistory } from './App.js';
import { lock } from './App.js';

var Latex = require('react-latex');

var Comments = React.createClass({
    getInitialState: function() {
        this.timer();
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
    timer : function() {
        let self = this;
        setTimeout(function () { 
            if (self.isMounted()) {
                self.setState({
                    actualDateTime: new Date().toString(),
                });
                self.timer();
            }
        }, 1000)
    },
    clearTextarean: function(id) {
        let textArea = document.getElementById(id);
        textArea.value="";
        this.textAreaAdjust(id);
    },
    textAreaAdjust: function(id) {
        let textArea = document.getElementById(id);
        if (!JSON.parse(localStorage.getItem('profile'))) {
            textArea.value="";
            browserHistory.replace('/');
            lock.show();
        }
        textArea.style.height = "0px";
        textArea.style.height = (textArea.scrollHeight)+"px";
        if (document.getElementById(id).value !== "") {
            this.setState({
                comment: document.getElementById(id).value,
                showPreview: true,
            })
        } else {
            this.setState({
                comment: "",
                showPreview: false,
            })
        }
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
                        document.getElementById("commentArea" + id).value = "";
                        this.textAreaAdjust("commentArea" + id);
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
        let lastIsMine = false;
        if (JSON.parse(localStorage.getItem('profile'))) {
            var profile =  JSON.parse(localStorage.getItem('profile'));
            var authorNickname = profile.nickname;
            lastIsMine = 
                this.state.lastCommentAuthor === authorNickname;
            var profilePicture = profile.picture;
            if (profile.user_metadata && profile.user_metadata.picture)
                profilePicture = host + "/resources/avatars/" + profile.user_metadata.picture;
        }
        if (this.state.comments) {
            let commentAreaID = "commentArea" + this.state.mem.ID;
            let self = this;
            let a1 = '$ a_{1} $';
            let aFracb = '$ \\frac{a}{b} $';
            let overx = '$ \\overline{x}  $';
            
            return (
                <div className="comments center" id="comments">
                    {
                        (this.state.comments).map( function(comment, index) { 
                            let key = "comment" + comment.ID;
                            return (
                                <Comm editable={lastIsMine} key={key} comment={comment} index={index} update={self.updateComment} delete={self.deleteComment}/>
                            )
                        })
                    }
                    { (profile && this.state.showPreview) &&
                        <div className="center relative">
                            <div className="margin3">
                                <img data-tip="check profile" alt="" src={profilePicture} className="commentPhoto"/>
                                <span className="span" data-tip="check profile" >{authorNickname}</span> | {this.state.actualDateTime} | Points: 0
                                <img data-tip="add point" className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                                <img data-tip="delete" alt="" src="/img/xIcon.png" className="deleteComment right" onClick={() => this.clearTextarean(commentAreaID)}/>
                            </div>
                            <div className="comment">
                                {
                                    this.state.comment.split('\\#').map(function(item, key) {
                                       return (
                                            <span key={key}>
                                                <Latex>{item}</Latex>
                                                <br/>
                                            </span>
                                            
                                       )
                                    })
                                }
                            </div>
                        </div>
                    }
                    { (this.state.showPreview && this.state.showExpressions) &&
                        <div>
                            <div className="margin3">
                                {
                                    (this.state.expressions).map( function(expression, index) { 
                                        let key = "expression" + index;
                                        return (
                                            <button key={key} className="btn btn-default" onClick={() => self.addExpression(expression)} ><Latex>{expression}</Latex></button>
                                        )
                                    })
                                }
                                <button key="expressionEnter" className="btn btn-default" onClick={() => self.addExpression("\\#")} >Enter</button>
                            </div>
                            <p className="margin3">
                                <button className="btn btn-primary" onClick={() => this.clearTextarean(commentAreaID)} >Clear</button>
                                <button className="btn btn-info" onClick={this.hideExpressions} >LaTeX</button>
                                <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Send</button>
                            </p>
                        </div>
                    }
                    { (this.state.showPreview && !this.state.showExpressions) &&
                        <p className="margin3">
                            <button className="btn btn-primary" onClick={() => this.clearTextarean(commentAreaID)} >Clear</button>
                            <button className="btn btn-primary" onClick={this.showExpressions} >LaTeX</button>
                            <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Send</button>
                        </p>
                    }
                    <p>
                        <textarea onKeyPress={this.keyPressed} onChangeCapture={() => this.textAreaAdjust(commentAreaID)} className="commentTextarea" maxLength="3000" id={commentAreaID} onChange={this.loadDescription} placeholder="Your comment ...">
                        
                        </textarea> 
                    </p>
                </div>
            )
        } else if (this.state.mem){
            let commentAreaID = "commentArea" + this.state.mem.ID;
            return (
                <div>
                    <div className="block">
                        <textarea onChangeCapture={() => this.textAreaAdjust(commentAreaID)} className="commentTextarea" maxLength="3000" id={commentAreaID} onChange={this.loadDescription} placeholder="Your comment ..."></textarea> 
                    </div>
                    <p>
                        <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Send</button>
                    </p>
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