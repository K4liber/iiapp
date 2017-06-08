import React from 'react';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone';

import Loading from './../Loading';

const uploadStyle = {
  overlay : {
    top               : '3%',
    bottom            : '3%',
    backgroundColor   : 'rgba(255, 255, 255, 0.75)',
    left: '50%',
    padding: '2rem',
    position: 'fixed',
    right: 'auto',
    transform: 'translate(-50%)',
    minWidth: '30rem',
    width: 'auto',
    height: 'auto',
    maxWidth: '70rem',
    zIndex: '98',
  },
  content : {
    overlfow: 'scroll',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    width: 'auto',
    padding: '3% 3% 3% 3%',
    marign: '0px',
    backgroundColor : 'rgba(248,248,248, 0.9)',
  }
};

var UploadImage = React.createClass({
    getIntialState: function() {
        fileUrl: null
    },
    componentWillMount : function(props) {
        this.state = {
            fileUrl : this.props.fileUrl,
        };
    },
    render: function() {
        return (
            <Modal
                isOpen={true}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeComments}
                style={uploadStyle}
                contentLabel="Example Modal"
                >
                { this.props.fileUrl &&
                    <div className="memUpload">
                        <p>Uploading file ...</p>
                        <p>
                            <img alt="" className="avatarImage" src={this.props.fileUrl}/>
                        </p>
                        <p>Please wait a second ...</p>
                        <p>
                            <Loading/>
                        </p>
                    </div>
                }
                { !this.props.fileUrl &&
                    <div>
                        Modal content
                        <Dropzone 
                            multiple={false}
                            accept="image/*"
                            onDrop={this.props.onDrop}>
                            <p>Drop an image or click to select a file to upload.</p>
                        </Dropzone> 
                    </div>
                }
            </Modal>
        )
    }
})

export default UploadImage;