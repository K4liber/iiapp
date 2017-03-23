import React from 'react';
import request from 'superagent';
import MemDropzone from './MemDropzone'

const UPLOAD_URL = 'http://localhost:8080/addMem/';

var Upload = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            uploadedFileCloudinaryUrl: '',
            fileUrl : null
        };
    },
    onImageDrop : function(files) {
        this.setState({
            uploadedFile: files[0],
            fileUrl : files[0].preview,
        });
        console.log(files[0]);
        this.render();
    },
    cancelImage : function() {
        this.setState({
            fileUrl : null,
        });
        this.render();
    },
    handleImageUpload : function(file) {
        let upload = request.post(UPLOAD_URL)
                        .field('Bearer ', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile);
        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== '') {
                this.setState({
                uploadedFileCloudinaryUrl: response.body.secure_url
                });
            }
        });
    },
    render : function() {
        return (
            <div className="row well well-sm">
                <div className="contentLeft col-md-8" id="contentLeft">
                    <div className="mem centering">
                        <MemDropzone onX={this.cancelImage} onDrop={this.onImageDrop} fileUrl={this.state.fileUrl}/>
                    </div>
                    <textarea placeholder="Title ..."></textarea> 
                </div>
                <div className="contentRight col-md-4" id="contentRight">
                    
                </div>
            </div>
        )
    }
});

export default Upload;