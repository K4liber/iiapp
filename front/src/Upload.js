import React from 'react';
import request from 'superagent';
import Modal from 'react-modal';

import MemDropzone from './MemDropzone'

import { hostName } from './App.js';
import { host } from './App.js';
import { lock } from './App.js';

const warningsStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    
  }
};

var Upload = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            uploadedFile: null,
            fileUrl : null,
            title : null,
            comment : "",
            category : "another",
            warnings: [],
            showWarnings: false,
            showLoading: false,
            loadingMessage: "Please wait a second...",
        };
        if (!localStorage.getItem('profile')) {
            lock.show();
        }
    },
    closeWarnings: function() {
        this.setState({showWarnings: false});
    },
    openWarnings: function(warnings) {
        this.setState({
            showWarnings: true,
            warnings: warnings,
        });
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
    textAreaAdjust: function() {
        let textArea = document.getElementById("commentArea");
        textArea.style.height = "0px";
        textArea.style.height = (textArea.scrollHeight)+"px";
    },
    postMem : function() {
        var warnings = [];
        if (!this.state.uploadedFile) {
            warnings.push("You have to load vision's image.")
        }
        if (document.getElementById("categoryImage")) {
            var category = document.getElementById("categoryImage").alt;
            this.setState({category: category});
        } else {
            warnings.push("You have to choose vision's image category.")
        }
        if (!this.state.title) {
            warnings.push("You did not tap a title!");
        }
        if (this.state.uploadedFile) {
            if (this.state.uploadedFile.size > 512000) {
                warnings.push("Image size cannot be more than 500kB");
            }
            var res = this.state.uploadedFile.type.split("/"); 
            if (res[0] !== "image") {
                warnings.push("Wrong image format.");
            }
        }
        if (warnings.length !== 0) {
            this.openWarnings(warnings);
            return
        }
        this.setState({
            showLoading : true,
        });
        let profile = JSON.parse(localStorage.getItem('profile'));
        let nickname = profile.nickname;
        var profilePicture = profile.picture;
        if (profile.user_metadata && profile.user_metadata.picture)
            profilePicture = host + "/resources/avatars/" + profile.user_metadata.picture;
        let UPLOAD_URL = hostName + "/addMem";
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
                this.setState({
                    loadingMessage : "Error while uploading.",
                });
            }
            if (response.status === 200){
                this.setState({
                    showLoading : false,
                });
                this.props.browserHistory.push('/profile/' + nickname);
            }
        });
    },
    render : function() {
        if (localStorage.getItem('profile')) {
            let warnings = this.state.warnings;
            let loadingMessage = this.state.loadingMessage;
            return (
                <div className="row well well-sm">
                    <div className="contentLeft col-md-12" id="contentLeft">
                        <Modal
                            isOpen={this.state.showLoading}
                            onRequestClose={this.closeLoading}
                            animationType={"fade"}
                            style={warningsStyle}
                            transparent={true}
                            contentLabel={"Uploading"}
                        >   
                            <div className="centering">
                                <p>Uploading</p>
                                <p><img alt="" src="/img/loading.gif"/></p>
                                <p>{loadingMessage}</p>
                            </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.showWarnings}
                            onRequestClose={this.closeWarnings}
                            animationType={"fade"}
                            style={warningsStyle}
                            transparent={true}
                            contentLabel={"Comments"}
                        >   
                            <div className="centering">
                                {warnings &&
                                    warnings.map( function(warning, index) {
                                        let key= "warning" + index;
                                        return (
                                            <div key={key}>{warning}</div>
                                        )
                                    })
                                }
                                <button onClick={this.closeWarnings} className="btn btn-primary margin3">OK</button>
                            </div>
                        </Modal>
                        <div className="mem centering" style={{ width: "80%" }} >
                            <MemDropzone onX={this.cancelImage} onDrop={this.onImageDrop} 
                            fileUrl={this.state.fileUrl} />
                        </div>
                        <div className="comments">
                            <textarea id="titleArea" className="signatureTextarea" maxLength="100" onChange={this.loadTitle} placeholder="Signature ..."></textarea> 
                            <textarea onChangeCapture={this.textAreaAdjust} id="commentArea" className="commentTextarea" maxLength="1000" onChange={this.loadComment} placeholder="Be the first to comment!"></textarea> 
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