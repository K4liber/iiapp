import React from 'react';
import AvatarDropzone from './AvatarDropzone.js';
import request from 'superagent';

import { CLIENT_DOMAIN } from './App.js';
import { hostName } from './App.js';

var req = require("request");

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
        let nickname = JSON.parse(localStorage.getItem('profile')).nickname;
        let UPLOAD_URL = hostName + "/uploadAvatar";
        let res = this.state.uploadedFile.type.split("/"); 
        let upload = request.post(UPLOAD_URL)
                        .field('Bearer ', localStorage.getItem('token'))
                        .field('file', this.state.uploadedFile)
                        .field('extension', res[1])
                        .field('enctype', 'multipart/form-data')
                        .field('Content-Type', 'multipart/form-data')
                        .field('nickname', nickname)
        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }
            if (response.status === 200) {
                alert("Success!");
                let avatarName = nickname + "." + res[1];
                console.log(avatarName);
                this.updateProfilePicture(avatarName);
            }
        });
    },
    updateProfilePicture: function(pictureName) {
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFqZENNMFV5T0VNM00wRXdNVFZHUVVRMk56RkdOVGMyTkRZMk0wSXdRME00TkVVelFVUkVPUSJ9.eyJpc3MiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tLyIsInN1YiI6ImNyeTUwV0ZYNVJrSUlVbGY1aUdiRnFwQURqQ1g3UlRrQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tL2FwaS92Mi8iLCJleHAiOjE0OTEzOTQ0NDksImlhdCI6MTQ5MTMwODA0OSwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMifQ.DrGEYgN3ibhyOsl6JTVsVYe37a5pqh7ekKdYKWRJn51ZSzh8xNFaZ1WRA7le1xdJVBLgUh4dD87nMpparkdkJ-6FjaIsPy897PpJoIJHtBZGv57iNiLWoOQCJrs400N4t0gLppPSO-_cQ11O48a7gOtfNPJw4uBK_lf7SSjwKkRAeszGzCi47C6yGiRh1JwvTbPAd9jc2o42gNvkKHh0riuOAQlgwyCZGT9W5_uOe3keGFKxuaHjWRrx_2NVi_sKREpyMBQWpxAWPNAnHvN7TSmNNooHyXzcrZe42pV4zJ05-wHhosGjNVc5c2wDW8m4eXielqXnFL1CrCM2jMIH0Q";
        let id = JSON.parse(localStorage.getItem('profile')).user_id;
        let url = 'https://' + CLIENT_DOMAIN + '/api/v2/users/' + id;
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token ,
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
        if (profile.user_metadata.picture)
          picture = hostName + "/resources/avatars/" + profile.user_metadata.picture
        return (
            <div className="row well well-sm">
              <script src="/static/js/auth0-editprofile.min.js"></script>
              <div className="contentLeft col-md-12" id="contentLeft">
                <p>{profile.nickname}</p>
                <div>
                  <img alt="" src={picture} className="avatarImage" />
                </div>
                <div className="centering">
                  <AvatarDropzone onX={this.cancelImage} onDrop={this.onImageDrop} 
                          fileUrl={this.state.fileUrl} />
                  <button onClick={this.uploadAvatar} className="btn btn-primary">Upload</button>
                </div>
              </div>
            </div>
          );
        } else 
        return ( <div>Loading settings...</div> );
    }
});

export default Settings;