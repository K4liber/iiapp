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
    doLike : function() {
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
                if (response.status === 200 && response.text !== "false") {
                    let comment = this.state.comment;
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
    render : function () {
        if (this.state.comment) {
            let comment = this.state.comment;
            let profile = JSON.parse(localStorage.getItem('profile'));
            var picture = comment.AuthorPhoto;
            if (profile.user_metadata.picture)
                var picture = hostName + "/resources/avatars/" + profile.user_metadata.picture
            return (
                <div className="comment">
                    <div>
                        <img alt="" src={picture} className="commentPhoto"/>
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