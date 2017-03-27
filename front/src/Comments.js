import React from 'react';

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
        this.serverRequest = client.get('http://localhost:8080/mem/' + memId, function(result) {
        this.setState({
            comments: JSON.parse(result).Comments,
            mem: JSON.parse(result).Mem,
        });
        }.bind(this));
    },
    render : function () {
        if (this.state.comments) {
            return (
                <div>
                    <p>
                        #{this.state.mem.Signature}
                    </p>
                    {
                    (this.state.comments).map( function(comment, index) { 
                        return (
                            <div className="comment">
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
                    <p>
                        <button className="btn btn-primary">Comment</button>
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