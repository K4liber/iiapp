import React from 'react';

var Categories = React.createClass({
  goHome : function() {
    this.props.browserHistory.push('/');
  },
  render : function() {
    return (
      <div className="menu right col-md-8">
        <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo"/>
        <img alt="" src="/img/ball.png" className="iconLogo"/>
        <img alt="" src="/img/scienceIcon.png" className="iconLogo"/>
        <img alt="" src="/img/movieIcon.png" className="iconLogo"/>
        <img alt="" src="/img/peopleIcon.png" className="iconLogo"/>
        <img alt="" src="/img/politicIcon.png" className="iconLogo"/>
        <img alt="" src="/img/musicIcon.png" className="iconLogo"/>
        <img alt="" src="/img/economyIcon.png" className="iconLogo"/>
      </div>
    )
  }
});

export default Categories;