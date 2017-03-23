import React from 'react';
import Dropzone from 'react-dropzone';

var MemDropzone = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            fileUrl : this.props.fileUrl,
        };
    },
    render : function() {
        if(this.props.fileUrl) {
            return (
                <div className="memUpload">
                    <img className="memImage" src={this.props.fileUrl}/>
                    <button className="cancelUpload" onClick={this.props.onX}>X</button>
                </div>
            )
        } else {
            return (
                <div style={{margin: "0 auto", width: "200px"}}>
                    <Dropzone
                        multiple={false}
                        accept="image/*"
                        onDrop={this.props.onDrop}>
                        <p>Drop an image or click to select a file to upload.</p>
                    </Dropzone>  
                </div>
            )
        }
    }
});

export default MemDropzone;