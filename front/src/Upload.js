import React from 'react';
import request from 'superagent';
import MemDropzone from './MemDropzone'

const UPLOAD_URL = 'http://10.17.2.143:300/addMem';

var Upload = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            uploadedFile: null,
            fileUrl : null,
            title : null,
            comment : "null",
            category : "own",
        };
    },
    loadTitle : function() {
        var title = document.getElementById("titleArea").value;
        this.setState({title: title});
    },
    loadComment : function() {
        var comment = document.getElementById("commentArea").value;
        this.setState({comment: comment});
    },
    onImageDrop : function(files) {
        this.setState({
            uploadedFile: files[0],
            fileUrl : files[0].preview,
        });
        this.render();
    },
    cancelImage : function() {
        this.setState({
            fileUrl : null,
            uploadedFile : null,
        });
        this.render();
    },
    commentIsOK : function() {
        if (this.state.comment)
            return true;
        else    
            return false;
    },
    postMem : function() {
        var category = document.getElementById("categoryImage").alt;
        this.setState({category: category});
        if (!this.state.uploadedFile) {
            alert("Nie dodales zdjecia!");
            return
        }
        if (!this.state.title) {
            alert("Nie dodales tytulu!");
            return
        }
        let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
        let profilePicture = JSON.parse(localStorage.getItem('profile')).picture;
        console.log(this.state.category);
        var res = this.state.uploadedFile.type.split("/"); 
        if (res[0] !== "image")
            alert("Zly format obrazka");
        let upload = request.post(UPLOAD_URL)
                        .field('Bearer ', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile)
                        .field('extension', res[1])
                        .field('enctype', 'multipart/form-data')
                        .field('title', this.state.title)
                        .field('comment', this.state.comment)
                        .field('author', nickname)
                        .field('category', category)
                        .field('profilePicture', profilePicture);
        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }
            if (response.status === 200)
                alert("dodano mema!");
        });
    },
    render : function() {
        if (localStorage.getItem('profile')) {
            return (
                <div className="row well well-sm">
                    <div className="contentLeft col-md-12" id="contentLeft">
                        <div className="mem centering" style={{ width: "80%" }} >
                            <MemDropzone onX={this.cancelImage} onDrop={this.onImageDrop} 
                            fileUrl={this.state.fileUrl} />
                        </div>
                        <div>
                            <textarea id="titleArea" onChange={this.loadTitle} placeholder="Signature ..."></textarea> 
                        </div>
                        <div>
                            <textarea id="commentArea" onChange={this.loadComment} placeholder="Comment (you can optionaly add first comment) ..."></textarea> 
                        </div>
                        <p>
                            <button onClick={this.postMem} className="btn btn-primary">Send</button>
                        </p>
                    </div>
                </div>
            )
        } else {
            this.props.browserHistory.push('/');
            this.props.lock.show();
            return (
                <div className="row well well-sm">
                    <div className="contentLeft col-md-12" id="contentLeft">
                        You have to log in to add new Idea.
                    </div>
                </div>
            )
        }
    }
});

export default Upload;