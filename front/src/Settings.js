import React from 'react';
import Modal from 'react-modal';

import AvatarDropzone from './AvatarDropzone.js';

import { CLIENT_DOMAIN } from './App.js';
import { hostName } from './App.js';
import { host } from './App.js';
import { API_TOKEN } from './App.js';
import { browserHistory } from './App.js';

import request from 'superagent';

const uploadingStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    
  }
};

var Settings = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      showDropzone: false,
      showLoading: false,
    }
  },
  componentDidMount: function() {
    let profile = localStorage.getItem('profile');
    this.setState({
      profile: profile,
      uploadedFile: null,
      fileUrl: null,
    });
  },
  uploadAvatar : function() {
        this.setState({
            showLoading : true,
        });
        if (!this.state.uploadedFile) {
            alert("Nie dodales zdjecia!");
            return
        }
        let profile = JSON.parse(localStorage.getItem('profile'));
        let UPLOAD_URL = hostName + "/uploadAvatar";
        let res = this.state.uploadedFile.type.split("/"); 
        let upload = request.post(UPLOAD_URL)
                        .field('Bearer ', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile)
                        .field('extension', res[1])
                        .field('enctype', 'multipart/form-data')
                        .field('Content-Type', 'multipart/form-data')
                        .field('authorNickname', profile.nickname)
                        .field('userID', profile.user_id)
        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }
            if (response.status === 200) {
                let avatarName = profile.nickname + "." + res[1];
                this.updateProfilePicture(avatarName);
                //window.location.replace (apiHost + "/settings");
            }
        });
    },
    updateProfilePicture: function(pictureName) {
        let id = JSON.parse(localStorage.getItem('profile')).user_id;
        let url = 'https://' + CLIENT_DOMAIN + '/api/v2/users/' + id;
        var payload = JSON.stringify(
          {
              "user_metadata": {
                  "picture": pictureName
              }
          }
        );
        let update = request.patch(url)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + API_TOKEN)
          .send(payload)
        update.end((err, response) => {
          if (err) {
              console.error(err);
          }
          if (response.status === 200) {
              this.setState({
                  showLoading : false,
              });
              browserHistory.replace(host + "/settings");
              //localStorage.setItem('profile', JSON.parse(response.text));
          }
        });
    },
    onImageDrop : function(files) {
        let isOk = true;
        var res = files[0].type.split("/"); 
        if (res[0] !== "image") {
            alert("Wrong image format!");
            isOk = false;
        }
        if (files[0].size > 102400) {
            alert("Size cannot be more than 100kB");
            isOk = false;
        }
        if (isOk) {
          this.setState({
              uploadedFile: files[0],
              fileUrl : files[0].preview,
          });
          this.render();
        }
    },
    cancelImage : function() {
        this.setState({
            fileUrl : null,
            uploadedFile : null,
        });
        this.render();
    },
    edit : function() {
      if (this.state.showDropzone) {
        this.setState({
          showDropzone: false
        })
      } else {
        this.setState({
          showDropzone: true
        })
      }
    },
    changeTooltip : function() {

    },
    render: function() {
      if (this.state.profile) {
        let profile = JSON.parse(localStorage.getItem('profile'));
        var picture = profile.picture;
        if (profile.user_metadata && profile.user_metadata.picture)
          picture = host + "/resources/avatars/" + profile.user_metadata.picture
        return (
            <div className="row">
                <Modal
                    isOpen={this.state.showLoading}
                    onRequestClose={this.closeLoading}
                    animationType={"fade"}
                    style={uploadingStyle}
                    transparent={true}
                    contentLabel={"Uploading"}
                >   
                    <div className="centering">
                        <p>Uploading</p>
                        <p><img alt="" src="/img/loading.gif"/></p>
                        <p>Please wait a second ...</p>
                    </div>
                </Modal>
                <div className="contentLeft col-md-12" id="contentLeft">
                <p>Hello {profile.nickname}!</p>
                <div className="checkbox">
                  <label><input type="checkbox" defaultChecked onChange={this.changeTooltip}/> Show tooltips</label>
                </div>
                <div className="mem">
                  <div className="memImage">
                    <img alt="" src={picture} className="avatarImage" />
                    <img data-tip="edit" alt="" src="/img/spannerIcon.png" className="cancelUpload" onClick={this.edit}/>
                  </div>
                </div>
                { this.state.showDropzone &&
                  <div className="centering comments">
                    <AvatarDropzone onX={this.cancelImage} onDrop={this.onImageDrop} 
                            fileUrl={this.state.fileUrl} />
                    <button onClick={this.uploadAvatar} className="btn btn-primary margin3">Upload</button>
                  </div>
                }
              </div>
            </div>
          );
        } else 
        return ( <div>Loading settings...</div> );
    }
});

export default Settings;