import React from 'react';
import request from 'superagent';

const UPLOAD_URL = 'http://10.17.2.143:300/addComment';

var HttpClient = function(sendToken) {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true ); 
        if (sendToken && localStorage.getItem('token')) {
          anHttpRequest.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('token'));
        }       
        anHttpRequest.send( null );
    }
}

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
        this.serverRequest = client.get('http://10.17.2.143:300/mem/' + memId, function(result) {
            this.setState({
                comments: JSON.parse(result).Comments,
                mem: JSON.parse(result).Mem,
            });
        }.bind(this));
    },
    sendComment : function(id) {
        let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
        let profilePicture = JSON.parse(localStorage.getItem('profile')).picture;
        let memId = this.props.memId;
        var comment = document.getElementById("commentArea" + id).value;
        
        let upload = request.post(UPLOAD_URL)
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
                var comment = document.getElementById("commentArea" + id).value = "";
        });
    },
    render : function () {
        if (this.state.comments) {
            let commentAreaID = "commentArea" + this.state.mem.ID;
            return (
                <div>
                    <p>
                        #{this.state.mem.Signature}
                    </p>
                    {
                    (this.state.comments).map( function(comment, index) { 
                        return (
                            <div key={comment.ID} className="comment">
                                <div>
                                    {comment.DateTime}
                                </div>
                                <div>
                                    <img alt="" src={comment.AuthorPhoto} className="commentPhoto"/>
                                    {comment.AuthorNickname}
                                </div>
                                <div>
                                    {comment.Content}.
                                </div>
                            </div>
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
                    <p>
                        #{this.state.mem.Signature}
                    </p>
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