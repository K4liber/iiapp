import React from 'react';
import request from 'superagent';
import MemDropzone from './MemDropzone'

import { hostName } from './App.js';
import { lock } from './App.js';

var Upload = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            uploadedFile: null,
            fileUrl : null,
            title : null,
            comment : "null",
            category : "another",
        };
        if (!localStorage.getItem('profile')) {
            lock.show();
        }
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
            alert("You did not load an image!");
            return
        }
        if (!this.state.title) {
            alert("You did not tap a title!");
            return
        }
        if (this.state.uploadedFile.size > 512000) {
            alert("Image size cannot be more than 500kB");
            return
        }
        let profile = JSON.parse(localStorage.getItem('profile'));
        let nickname = profile.nickname;
        var profilePicture = profile.picture;
        if (profile.user_metadata && profile.user_metadata.picture)
            profilePicture = hostName + "/resources/avatars/" + profile.user_metadata.picture;
        let UPLOAD_URL = hostName + "/addMem";
        var res = this.state.uploadedFile.type.split("/"); 
        if (res[0] !== "image") {
            alert("Wrong image format!");
            return
        }
        let upload = request.post(UPLOAD_URL)
                        .field('userID', profile.user_id)
                        .field('token', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile)
                        .field('extension', res[1])
                        .field('enctype', 'multipart/form-data')
                        .field('title', this.state.title)
                        .field('comment', this.state.comment)
                        .field('authorNickname', nickname)
                        .field('category', category)
                        .field('profilePicture', profilePicture);
        upload.end((err, response) => {
            if (err) {
                alert(response.text)
            }
            if (response.status === 200)
                this.props.browserHistory.push('/profile/' + nickname);
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
                        <div className="comments">
                            <textarea id="titleArea" className="signatureTextarea" maxLength="100" onChange={this.loadTitle} placeholder="Signature ..."></textarea> 
                            <textarea id="commentArea" className="commentTextarea" maxLength="1000" onChange={this.loadComment} placeholder="Comment (you can optionaly add first comment) ..."></textarea> 
                        </div>
                        <p>
                            <button onClick={this.postMem} className="btn btn-primary margin3">Send</button>
                        </p>
                    </div>
                </div>
            )
        } else {
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