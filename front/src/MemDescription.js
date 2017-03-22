import React from 'react';

var MemDescription = React.createClass({
    getInitialState: function() {
        return {
        mem: null
        }
    },
    componentDidMount: function() {
        let memId = this.props.memId;
        /** TODO get mem desc
        isLogged = true;
        var client = new HttpClient(true);
        this.serverRequest = client.get('http://localhost:8080/mems', function(result) {
        this.setState({
            mems: result,
            isLogged: isLogged,
        });
        }.bind(this));
        */
    },
    render : function () {
        let memId = this.props.memId;
        return (
            <div>
                TU jest opis mema o id {memId}.
            </div>
        )
    }
});

export default MemDescription;