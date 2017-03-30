import React from 'react';

var Categories = React.createClass({
  goHome : function() {
    this.props.browserHistory.push('/');
  },
  selectCategory : function(category) {
    this.props.browserHistory.push('/category/' + category);
  },
  render : function() {
    return (
      <div className="menu right col-md-8">
        <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
        <img alt="" src="/img/sportIcon.png" onClick={(event)=>this.selectCategory("sport")} className="iconLogo left"/>
        <img alt="" src="/img/scienceIcon.png" onClick={(event)=>this.selectCategory("science")} className="iconLogo left"/>
        <img alt="" src="/img/movieIcon.png" onClick={(event)=>this.selectCategory("movie")} className="iconLogo left"/>
        <img alt="" src="/img/peopleIcon.png" onClick={(event)=>this.selectCategory("people")} className="iconLogo left"/>
        <img alt="" src="/img/politicIcon.png" onClick={(event)=>this.selectCategory("politic")} className="iconLogo left"/>
        <img alt="" src="/img/musicIcon.png" onClick={(event)=>this.selectCategory("music")} className="iconLogo left"/>
        <img alt="" src="/img/economyIcon.png" onClick={(event)=>this.selectCategory("economy")} className="iconLogo left"/>
        <img alt="" src="/img/ownIcon.png" onClick={(event)=>this.selectCategory("own")} className="iconLogo left"/>
      </div>
    )
  }
});

export default Categories;