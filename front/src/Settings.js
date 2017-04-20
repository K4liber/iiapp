import React from 'react';
import AvatarDropzone from './AvatarDropzone.js';
import request from 'superagent';

import { CLIENT_DOMAIN } from './App.js';
import { hostName } from './App.js';
import { API_TOKEN } from './App.js';
import { browserHistory } from './App.js';

import { request as req } from 'request';

var Settings = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
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
                alert("Success!");
                let avatarName = profile.nickname + "." + res[1];
                this.updateProfilePicture(avatarName);
            }
        });
    },
    updateProfilePicture: function(pictureName) {
        let id = JSON.parse(localStorage.getItem('profile')).user_id;
        let url = 'https://' + CLIENT_DOMAIN + '/api/v2/users/' + id;
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_TOKEN ,
        }
        var payload = JSON.stringify(
          {
              "user_metadata": {
                  "picture": pictureName
              }
          }
        );
        var options = { 
          method: 'PATCH',
          url: url,
          headers: headers,
          body: payload,
        };
        req(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(response);
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
    render: function() {
      if (this.state.profile) {
        let profile = JSON.parse(localStorage.getItem('profile'));
        var picture = profile.picture;
        if (profile.user_metadata && profile.user_metadata.picture)
          picture = hostName + "/resources/avatars/" + profile.user_metadata.picture
        return (
            <div className="row well well-sm">
              <script src="/static/js/auth0-editprofile.min.js"></script>
              <div className="contentLeft col-md-12" id="contentLeft">
                <p>Your nickname: {profile.nickname}</p>
                <div>
                  <p>Your avatar:</p>
                  <img alt="" src={picture} className="avatarImage" />
                </div>
                <div className="centering">
                  <AvatarDropzone onX={this.cancelImage} onDrop={this.onImageDrop} 
                          fileUrl={this.state.fileUrl} />
                  <button onClick={this.uploadAvatar} className="btn btn-primary margin3">Upload</button>
                </div>
              </div>
            </div>
          );
        } else 
        return ( <div>Loading settings...</div> );
    }
});

export default Settings;