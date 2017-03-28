import React from 'react';
import request from 'superagent';
import MemDropzone from './MemDropzone'

const UPLOAD_URL = 'http://localhost:8080/addMem';

var Upload = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            uploadedFile: null,
            fileUrl : null,
            title : null,
            description : null,
            category : "science",
        };
    },
    loadTitle : function() {
        var title = document.getElementById("titleArea").value;
        this.setState({title: title});
    },
    loadDescription : function() {
        var description = document.getElementById("descriptionArea").value;
        this.setState({description: description});
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
    descriptionIsOK : function() {
        if (this.state.description)
            return true;
        else    
            return false;
    },
    postMem : function() {
        if (!this.state.uploadedFile) {
            alert("Nie dodales zdjecia!");
            return
        }
        if (!this.state.title) {
            alert("Nie dodales tytulu!");
            return
        }
        if (!this.descriptionIsOK()) {
            alert("Nie dodales opisu!");
            return
        }
        let nickname = JSON.parse(localStorage.getItem('profile')).nickname
        var res = this.state.uploadedFile.type.split("/"); 
        if (res[0] != "image")
            alert("Zly format obrazka");
        let upload = request.post(UPLOAD_URL)
                        .field('Bearer ', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile)
                        .field('extension', res[1])
                        .field('enctype', 'multipart/form-data')
                        .field('title', this.state.title)
                        .field('description', this.state.description)
                        .field('author', nickname)
                        .field('category', this.state.category);
        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }
            if (response.status === 200)
                alert("dodano mema!");
        });
    },
    render : function() {
        return (
            <div className="row well well-sm">
                <div className="contentLeft col-md-8" id="contentLeft">
                    <div className="mem centering">
                        <MemDropzone onX={this.cancelImage} onDrop={this.onImageDrop} fileUrl={this.state.fileUrl}/>
                    </div>
                    <textarea id="titleArea" onChange={this.loadTitle} placeholder="Title ..."></textarea> 
                </div>
                <div className="contentRight col-md-4" id="contentRight">
                    <p>
                        # { this.state.title }
                    </p>
                    <textarea id="descriptionArea" onChange={this.loadDescription} placeholder="Description ..."></textarea> 
                    <p>
                        <button onClick={this.postMem} className="btn btn-primary">Send</button>
                    </p>
                </div>
            </div>
        )
    }
});

export default Upload;