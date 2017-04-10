import React from 'react';
import request from 'superagent';

import { hostName } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';
import { HttpClient } from './App.js';

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
    doLike : function() {
        if (localStorage.getItem('profile')) {
            let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
            let comment = this.state.comment;
            let commentID = this.props.comment.ID;
            let upload = request.post(hostName + "/addCommentPoint")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', commentID)
                .field('authorNickname', nickname)
                .field('memId', comment.MemID)
            upload.end((err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response.status === 200 && response.text !== "false") {
                    
                    comment.Like = true;
                    this.setState({
                        points: this.state.points+1,
                        comment: comment,
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
            let nickname = profile.nickname;
            let commentID = this.props.comment.ID;
            let upload = request.post(hostName + "/deleteCommentPoint")
                .field('Bearer ', localStorage.getItem('token'))
                .field('commentID', commentID)
                .field('authorNickname', nickname)
            upload.end((err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response.status === 200 && response.text !== "false") {
                    let comment = this.state.comment;
                    comment.Like = false;
                    this.setState({
                        points: this.state.points-1,
                        comment: comment,
                    });
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
        let self = this;
        if (confirm("You really want to delete this comment?")) {
            var client = new HttpClient(true);
            let url = hostName + "/deleteComment/" + this.state.comment.ID;
            this.serverRequest = client.get(url, function(result) {
                if(result) {
                    self.setState({
                        comment: null,
                    });
                }
            });
        }
    },
    render : function () {
        if (this.state.comment) {
            let comment = this.state.comment;
            var picture = comment.AuthorPhoto;
            var isMain = false;
            if (localStorage.getItem('profile'))
                isMain = comment.AuthorNickname === JSON.parse(localStorage.getItem('profile')).nickname;
            return (
                <div className="center relative">
                    <div onMouseEnter={this.showDetails} onMouseLeave={this.hideDetails}>
                        <img alt="" onClick={() => this.showProfile(comment.AuthorNickname)} src={picture} className="commentPhoto"/>
                        {comment.Content}
                        {isMain &&
                            <img alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.deleteComment}/>
                        }
                        <div>
                        {comment.AuthorNickname} | {comment.DateTime} | Points: {this.state.points} 
                        {!this.state.comment.Like && 
                            <img onClick={this.doLike}
                                className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                        }
                        {this.state.comment.Like && 
                            <img onClick={this.doUnLike}
                                className="thumbImage" alt="ASAS" src="/img/thumbDownIcon.png"/>
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