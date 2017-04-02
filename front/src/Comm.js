import React from 'react';
import request from 'superagent';
import { hostName } from './App.js';
import { lock } from './App.js';

var Comm = React.createClass({
    getInitialState: function() {
        return {
            comment: null,
            points: null,
        }
    },
    componentDidMount: function() {
        this.setState({
            comment: this.props.comment,
            points: this.props.comment.Points,
        });  
    },
    componentWillReceiveProps : function(newProps) {
        this.setState({
            comment: this.props.comment,
            points: this.props.comment.Points,
        });  
    },
    doLike : function(elementId) {
        if (localStorage.getItem('profile')) {
            let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
            let commentID = this.props.comment.ID;
            let upload = request.post(hostName + "/addCommentPoint")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', commentID)
                .field('authorNickname', nickname)
            upload.end((err, response) => {
            if (err) {
                console.log(err);
            }
            if (response.status === 200 && response.text !== "false")
                this.setState({
                    points: this.props.comment.Points+1,
                });
                document.getElementById(elementId).style.display = "none";
            });
        } else {
            lock.show();
        }
    },
    render : function () {
        if (this.state.comment) {
            let comment = this.state.comment;
            let like = this.state.comment.Like;
            let id = "thumb" + this.state.comment.ID;
            return (
                <div className="comment">
                    <div>
                        <img alt="" src={comment.AuthorPhoto} className="commentPhoto"/>
                        {comment.AuthorNickname} | {comment.DateTime} | Points: {this.state.points} 
                        {!like && 
                            <img onClick={() => this.doLike(id)} id={id}
                                className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                        }
                    </div>
                    <div>
                        {comment.Content}.
                    </div>
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

export default Comm;