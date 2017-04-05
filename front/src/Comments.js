import React from 'react';
import request from 'superagent';
import Comm from './Comm.js';

import { hostName } from './App.js';
import { HttpClient } from './App.js';
import { browserHistory } from './App.js';

var Comments = React.createClass({
    getInitialState: function() {
        return {
            comments: null,
            mem: null
        }
    },
    componentDidMount: function() {
        let memId = this.props.memId;
        var client = new HttpClient(true);
        this.serverRequest = client.get(hostName + '/mem/' + memId, function(result) {
            this.setState({
                comments: JSON.parse(result).Comments,
                mem: JSON.parse(result).Mem,
            });
        }.bind(this));
    },
    componentWillReceiveProps : function(newProps) {
        let memId = this.props.memId;
        var client = new HttpClient(true);
        this.serverRequest = client.get(hostName + '/mem/' + memId, function(result) {
            this.setState({
                comments: JSON.parse(result).Comments,
                mem: JSON.parse(result).Mem,
            });
        }.bind(this));
    },
    goToIdea: function() {
        browserHistory.replace('/idea/' + this.props.memId);
    },
    sendComment : function(id) {
        let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
        if (nickname) {
            let profilePicture = JSON.parse(localStorage.getItem('profile')).picture;
            var comment = document.getElementById("commentArea" + id).value;
            let upload = request.post(hostName + "/addComment")
                            .field('Bearer ', localStorage.getItem('token'))
                            .field('nickname', nickname)
                            .field('profilePicture', profilePicture)
                            .field('memID', this.props.memId)
                            .field('comment', comment)
            upload.end((err, response) => {
                if (err) {
                    console.error(err);
                }
                if (response.status === 200)
                    alert("Your comment has been added!");
                    this.componentDidMount();
                    document.getElementById("commentArea" + id).value = "";
            });
        } else {
            alert(
                "Please login to send a comment!" +
                <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Comment</button>
            );
        }
    },
    render : function () {
        if (this.state.comments) {
            let commentAreaID = "commentArea" + this.state.mem.ID;
            return (
                <div>
                    <div className="commentSignature" onClick={this.goToIdea}>
                        #{this.state.mem.Signature}
                    </div>
                    {
                        (this.state.comments).map( function(comment, index) { 
                            let key = "comment" + comment.ID;
                            return (
                                <Comm key={key} comment={comment} index={index}/>
                            )
                        })
                    }
                    <div>
                        <textarea id={commentAreaID} onChange={this.loadDescription} placeholder="Comment ..."></textarea> 
                    </div>
                    <p>
                        <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Comment</button>
                    </p>
                </div>
            )
        } else if (this.state.mem){
            let commentAreaID = "commentArea" + this.state.mem.ID;
            return (
                <div>
                    <div className="commentSignature">
                        #{this.state.mem.Signature}
                    </div>
                    <div>
                        <textarea id={commentAreaID} onChange={this.loadDescription} placeholder="Comment ..."></textarea> 
                    </div>
                    <p>
                        <button onClick={() => this.sendComment(this.state.mem.ID)} className="btn btn-primary">Comment</button>
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