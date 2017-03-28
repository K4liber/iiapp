import React from 'react';

var Categories = React.createClass({
  goHome : function() {
    this.props.browserHistory.push('/');
  },
  render : function() {
    return (
      <div className="menu right col-md-8">
        <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
        <img alt="" src="/img/sportIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/scienceIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/movieIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/peopleIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/politicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/musicIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/economyIcon.png" className="iconLogo left"/>
        <img alt="" src="/img/ownIcon.png" className="iconLogo left"/>
      </div>
    )
  }
});

export default Categories;