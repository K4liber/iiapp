import React from 'react';

import Expressions from './Expressions';
import UploadImage from './UploadImage';

import { store } from './../App.js';
import { lock } from './../App.js';
import { browserHistory } from './../App.js';
import { host } from './../App.js';

var Latex = require('react-latex');

var CommArea = React.createClass({
    getInitialState: function() {
        this.timer();
        return {
            showPreview: this.props.showPreview,
            comment: "",
            images: [],
            videos: [],
            youtube: [],
            showImageUpload: false,
            imageFiles: [],
            imageUrls: [],
        }
    },
    timer : function() {
        let self = this;
        setTimeout(function () { 
            if (self.isMounted()) {
                self.setState({
                    actualDateTime: new Date().toString(),
                });
                self.timer();
            }
        }, 1000)
    },
    clearComment: function() {
        let textArea = document.getElementById("commentArea");
        textArea.value="";
        this.textAreaAdjust();
        this.hideExpressions();
    },
    expressions: function() {
        if(store.getState()){
            store.dispatch( { type: "HIDELATEX" });
        } else {
            store.dispatch( { type: "SHOWLATEX" });
        }
    },
    textAreaAdjust: function() {
        let id = "commentArea";
        let textArea = document.getElementById(id);
        if (!JSON.parse(localStorage.getItem('profile'))) {
            textArea.value="";
            browserHistory.replace('/');
            lock.show();
        }
        textArea.style.height = "0px";
        textArea.style.height = (textArea.scrollHeight)+"px";

        //img
        var m,
        urls = [], 
        str = document.getElementById(id).value,
        rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }

        //source
        var m2,
        urls2 = [], 
        str2 = document.getElementById(id).value,
        rex2 = /<source[^>]+src="?([^"\s]+)"?\s*\/>/g;

        while ( m2 = rex2.exec( str2 ) ) {
            urls2.push( m2[1] );
        }

        //iframe
        var m3,
        urls3 = [], 
        str3 = document.getElementById(id).value,
        rex3 = /<iframe[^>]+src="?([^"\s]+)"?\s*\/>/g;

        while ( m3 = rex3.exec( str3 ) ) {
            urls3.push( m3[1] );
        }

        if (document.getElementById(id).value !== "") {
            this.setState({
                comment: document.getElementById(id).value,
                showPreview: true,
                images: urls,
                videos: urls2,
                youtube: urls3,
            })
        } else {
            this.setState({
                comment: "",
                showPreview: false,
            })
        }
    },
    keyPressed: function(e) {
        e = e || window.event;
        var key = e.keyCode ? e.keyCode : e.which;
        if (key === 13) {
            this.addExpression("<end>");
        }
        return;
    },
    addExpression : function(expression) {
        let id = "commentArea";
        var el = document.getElementById(id);
        var start = el.selectionStart;
        var end = el.selectionEnd;
        var text = el.value;
        var before = text.substring(0, start);
        var after  = text.substring(end, text.length);
        el.value = before + expression + after;
        el.selectionStart = el.selectionEnd = start + expression.length;
        el.focus();
        this.textAreaAdjust();
    },
    onSend : function() {
        this.props.onSend(this.correctImages());
        this.setState({
            comment: "",
            showPreview: false,
        })
    },
    correctImages : function() {
        var correctImages = []
        let id = "commentArea";
        var comment = document.getElementById(id).value;
        this.state.imageFiles.map(function(file, index) {
            if (comment.includes(file.preview)) {
                correctImages.push(file);
            }
        })
        return correctImages;
    },
    addImage : function() {
        this.setState({
            showImageUpload: true,
        })
    },
    addVideo : function() {
        this.addExpression("<source src=\"https://www.w3schools.com/tags/movie.mp4\"/>"
         + "<videotitle value=\"Video title\"/><end>");
    },
    addIframe : function() {
        this.addExpression(" <iframe src=\"https://www.youtube.com/embed/XGSy3_Czz8k\"/>"
         + "<youtube value=\"Youtube title\"/><end>");
    },
    onUploadImage : function(files) {
        this.setState({
            showImageUpload : false
        })
        let isOk = true;
        var res = files[0].type.split("/"); 
        if (res[0] !== "image") {
            alert("Wrong image format!");
            isOk = false;
        }
        if (files[0].size > 204800) {
            alert("Size cannot be more than 200kB");
            isOk = false;
        }
        if (isOk) {
            var imageFiles = this.state.imageFiles;
            imageFiles.push(files[0])
            this.setState({
                imageFiles: imageFiles,
            });
            this.addExpression("<img src=\"" + files[0].preview + "\"/>"
                + "<title value=\"Figure title\"/><end>");
        }
    },
    closeUploadImage: function() {
        this.setState({
            showImageUpload: false,
            imageUrl: null,
        })
    },
    render : function () {
        if (JSON.parse(localStorage.getItem('profile'))) {
            var profile =  JSON.parse(localStorage.getItem('profile'));
            var authorNickname = profile.nickname;
            var profilePicture = profile.picture;
            if (profile.user_metadata && profile.user_metadata.picture)
                profilePicture = host + "/resources/avatars/" + profile.user_metadata.picture;
        }
        var self = this;
        var imageIndex=0;
        var videoIndex=0;
        var youtubeIndex=0;
        return (
            <div>
                { this.state.showImageUpload &&
                    <UploadImage onDrop={this.onUploadImage} fileUrl={this.state.imageUrl} onX={this.closeUploadImage}/>
                }
                { this.state.showPreview &&
                    <div className="center relative">
                        <div className="margin3">
                            <img data-tip="check profile" alt="" src={profilePicture} className="commentPhoto"/>
                            <span className="span" data-tip="check profile" >{authorNickname}</span> | {this.state.actualDateTime} | Points: 0
                            <img data-tip="add point" className="thumbImage" alt="ASAS" src="/img/thumbIcon.png"/>
                            <img data-tip="close preview" alt="" src="/img/xIcon.png" className="deleteComment right" onClick={this.clearComment}/>
                        </div>
                        <div className="comment">
                        {
                            this.state.comment.split("<end>").map(function(item, index) {
                                var itemKey = "latex" + index;
                                //img title
                                var rexImg = /<title[^>]+value="?([^]+)?"\s*\/>/g;
                                var img = rexImg.exec(item);
                                if (img && img[1])
                                    imageIndex++;
                                
                                //video videotitle
                                var rexVideo = /<videotitle[^>]+value="?([^]+)?"\s*\/>/g;
                                var video = rexVideo.exec(item);
                                if (video && video[1])
                                    videoIndex++;

                                //youtube youtube
                                var rexYoutube = /<youtube[^>]+value="?([^]+)?"\s*\/>/g;
                                var youtube = rexYoutube.exec(item);
                                if (youtube && youtube[1])
                                    youtubeIndex++;
                                return (
                                    <div key={itemKey}>
                                        { (img && img[1] && self.state.images[imageIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                        <img alt="" src={self.state.images[imageIndex-1]}/>
                                                        <figcaption>
                                                            <strong>Fig. {imageIndex} {img[1]}</strong>
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { (video && video[1] && self.state.videos[videoIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                        <video width="320" height="240" controls>
                                                            <source src={self.state.videos[videoIndex-1]} type="video/mp4"/>
                                                        </video>
                                                        <figcaption>
                                                            <strong>Vid. {videoIndex} {video[1]}</strong>
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { (youtube && youtube[1] && self.state.youtube[youtubeIndex-1]) &&
                                            <div>
                                                <Latex>{item}</Latex>
                                                <div className="center">
                                                    <figure>
                                                         <iframe width="420" height="315"
                                                            src={self.state.youtube[youtubeIndex-1]}>
                                                        </iframe> 
                                                        <figcaption>
                                                            <strong>Vid. {youtubeIndex} {youtube[1]}</strong>
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        }
                                        { ( (!img || !img[1]) && (!video || !video[1])  && (!youtube || !youtube[1]) ) &&
                                            <span>
                                                <Latex>{item}</Latex>
                                                <br/>
                                            </span>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                }
                <p>
                    <textarea onKeyPress={this.keyPressed} onChangeCapture={this.textAreaAdjust} className="commentTextarea" maxLength="3000" id="commentArea" onChange={this.loadDescription} placeholder="Type your text ...">
                    </textarea> 
                </p>
                <p>
                    { store.getState() &&
                        <Expressions onType={this.textAreaAdjust} areaID="commentArea"/>
                    }
                    <img data-tip="LaTeX" alt="" onClick={this.expressions} src="/img/latexIcon.png" className="iconLogo center"/>
                    <img data-tip="add image" alt="" onClick={this.addImage} src="/img/imgIcon.png" className="iconLogo center"/>
                    <img data-tip="youtube" alt="" onClick={this.addIframe} src="/img/youtubeIcon.png" className="iconLogo center"/>
                </p>
                <p className="margin3">
                    <button onClick={this.onSend} className="btn btn-primary">Send</button>
                </p>
            </div>
        )
    }
});

export default CommArea;