import React from 'react';
import Dropzone from 'react-dropzone';

import ReactTooltip from 'react-tooltip';

var MemDropzone = React.createClass({
    componentWillMount : function(props) {
        this.state = {
            fileUrl : this.props.fileUrl,
            categoryLink : "/img/starIcon.png",
        };
    },
    loadCategoryIcon : function(category) {
        let link = "/img/" + category + "Icon.png";
        document.getElementById("categoryImage").alt = category;
        console.log(link);
        this.setState({
            fileUrl : this.props.fileUrl,
            categoryLink : link,
        }).bind(this); 
    },
    render : function() {
        if(this.props.fileUrl) {
            return (
                <div className="memUpload">
                    <img alt="" className="memImage" src={this.props.fileUrl}/>
                    <img alt="" src="/img/xIcon.png" className="cancelUpload" onClick={this.props.onX}/>
                    <img alt="another" id="categoryImage" src={this.state.categoryLink} className="uploadLogoChoosen"/>
                    <div className="uploadCategories">
                        <img data-tip="entertainment" alt="" id="entertainment" onClick={(event)=>this.loadCategoryIcon("entertainment")} src="/img/entertainmentIcon.png" className="uploadLogo"/>
                        <img data-tip="science" alt="" id="science" onClick={(event)=>this.loadCategoryIcon("science")} src="/img/scienceIcon.png" className="uploadLogo"/>
                        <img data-tip="media" alt="" id="media" onClick={(event)=>this.loadCategoryIcon("movie")} src="/img/mediaIcon.png" className="uploadLogo"/>
                        <img data-tip="people" alt="" id="people" onClick={(event)=>this.loadCategoryIcon("people")} src="/img/peopleIcon.png" className="uploadLogo"/>
                        <img data-tip="politic" alt="" id="politic" onClick={(event)=>this.loadCategoryIcon("politic")} src="/img/politicIcon.png" className="uploadLogo"/>
                        <img data-tip="economy" alt="" id="economy" onClick={(event)=>this.loadCategoryIcon("economy")} src="/img/economyIcon.png" className="uploadLogo"/>
                        <img data-tip="another" alt="" id="another" onClick={(event)=>this.loadCategoryIcon("another")} src="/img/anotherIcon.png" className="uploadLogo"/>
                        <ReactTooltip />
                    </div>
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
                            <p>Drop an image or click to select a file to upload.</p>
                        </Dropzone> 
                    </div> 
                </div>
            )
        }
    }
});

export default MemDropzone;