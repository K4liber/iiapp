import React from 'react';

import Expressions from './Expressions';

import { store } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';
import { host } from './App.js';

var Latex = require('react-latex');

var CommArea = React.createClass({
    getInitialState: function() {
        this.timer();
        return {
            showLatex: store.getState(),
            showPreview: this.props.showPreview,
            comment: "",
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
    clearComment: function() {
        let textArea = document.getElementById("commentArea");
        textArea.value="";
        this.textAreaAdjust();
        this.hideExpressions();
    },
    showExpressions: function() {
        store.dispatch( { type: "SHOWLATEX" });
        this.setState({
            showLatex: store.getState()
        })
    },
    hideExpressions: function() {
        store.dispatch( { type: "HIDELATEX" });
        this.setState({
            showLatex: store.getState()
        })
    },
    textAreaAdjust: function() {
        let id = "commentArea";
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
    keyPressed: function(e) {
        e = e || window.event;
        var key = e.keyCode ? e.keyCode : e.which;
        if (key === 13) {
            this.addExpression("\\#");
        }
        return;
    },
    addExpression : function(expression) {
        let id = "commentArea";
        var el = document.getElementById(id);
        var start = el.selectionStart;
        var end = el.selectionEnd;
        var text = el.value;
        var before = text.substring(0, start);
        var after  = text.substring(end, text.length);
        el.value = before + expression + after;
        el.selectionStart = el.selectionEnd = start + expression.length;
        el.focus();
    },
    onSend : function() {
        this.props.onSend();
        this.setState({
            comment: "",
            showPreview: false,
        })
    },
    render : function () {
        if (JSON.parse(localStorage.getItem('profile'))) {
            var profile =  JSON.parse(localStorage.getItem('profile'));
            var authorNickname = profile.nickname;
            var profilePicture = profile.picture;
            if (profile.user_metadata && profile.user_metadata.picture)
                profilePicture = host + "/resources/avatars/" + profile.user_metadata.picture;
        }
        return (
            <div>
                { this.state.showPreview &&
                    <div className="center relative">
                        <div className="margin3">
                            <img data-tip="check profile" alt="" src={profilePicture} className="commentPhoto"/>
                            <span className="span" data-tip="check profile" >{authorNickname}</span> | {this.state.actualDateTime} | Points: 0
                            <img data-tip="add point" className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                            <img data-tip="delete" alt="" src="/img/xIcon.png" className="deleteComment right" onClick={this.clearComment}/>
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
                { this.state.showLatex &&
                        <Expressions onType={this.textAreaAdjust} areaID="commentArea"/>
                }
                <p>
                    <textarea onKeyPress={this.keyPressed} onChangeCapture={this.textAreaAdjust} className="commentTextarea" maxLength="3000" id="commentArea" onChange={this.loadDescription} placeholder="Type yout text ...">
                    </textarea> 
                </p>
                <div className="margin3">
                    <button className="btn btn-primary" onClick={this.clearComment} >Clear</button>
                    { this.state.showLatex &&
                        <button className="btn btn-info" onClick={this.hideExpressions} >LaTeX</button>
                    }
                    { !this.state.showLatex &&
                        <button className="btn btn-primary" onClick={this.showExpressions} >LaTeX</button>
                    }
                    <button onClick={this.onSend} className="btn btn-primary">Send</button>
                </div>
            </div>
        )
    }
});

export default CommArea;