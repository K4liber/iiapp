import React from 'react';
import Dropzone from 'react-dropzone';

var AvatarDropzone = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            fileUrl : this.props.fileUrl,
        };
    },
    render : function() {
        if(this.props.fileUrl) {
            return (
                <div className="memUpload">
                    <img alt="" className="avatarImage" src={this.props.fileUrl}/>
                    <img alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.props.onX}/>
                </div>
            )
        } else {
            return (
                <div className="relative loadMem">
                    <div className="centering">
                        <Dropzone 
                            multiple={false}
                            accept="image/*"
                            onDrop={this.props.onDrop}>
                            <p>Drop an image or click to select a new avatar.</p>
                        </Dropzone> 
                    </div> 
                </div>
            )
        }
    }
});

export default AvatarDropzone;