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

var MemDescription = React.createClass({
    getInitialState: function() {
        return {
        memDescription: null
        }
    },
    componentDidMount: function() {
        let memId = this.props.memId;
        var client = new HttpClient(true);
        this.serverRequest = client.get('http://localhost:8080/mem/' + memId, function(result) {
        this.setState({
            memDescription: result,
        });
        }.bind(this));
    },
    render : function () {
        if (this.state.memDescription) {
            let memDescription = JSON.parse(this.state.memDescription);
            return (
                <div>
                    <div>
                        {memDescription.AuthorNickname} : {memDescription.Title}
                    </div>
                    <div>
                        {memDescription.Description}.
                    </div>
                </div>
            )
        } else {
            let memId = this.props.memId;
            return (
                <div>
                    Loading ...
                </div>
            )
        }
    }
});

export default MemDescription;