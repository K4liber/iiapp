import React from 'react';
import { browserHistory } from './App';
var Categories = React.createClass({
  getInitialState: function() {
    return {
      show: false,
    }
  },
  goHome : function() {
    browserHistory.push('/');
  },
  selectCategory : function(category) {
    browserHistory.push('/category/' + category);
  },
  hideCategories : function () {
    this.setState({
      show: false,
    });
  },
  showCategories: function () {
    this.setState({
      show: true,
    });
  },
  render : function() {
    if(this.state.show) {
      return (
        <div>
          <img alt="" src="/img/arrowLeft.png" onClick={this.hideCategories} className="iconLogo left"/>
          <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
          <img alt="" src="/img/sportIcon.png" onClick={(event)=>this.selectCategory("sport")} className="iconLogo left"/>
          <img alt="" src="/img/scienceIcon.png" onClick={(event)=>this.selectCategory("science")} className="iconLogo left"/>
          <img alt="" src="/img/peopleIcon.png" onClick={(event)=>this.selectCategory("people")} className="iconLogo left"/>
          <img alt="" src="/img/politicIcon.png" onClick={(event)=>this.selectCategory("politic")} className="iconLogo left"/>
          <img alt="" src="/img/mediaIcon.png" onClick={(event)=>this.selectCategory("music")} className="iconLogo left"/>
          <img alt="" src="/img/economyIcon.png" onClick={(event)=>this.selectCategory("economy")} className="iconLogo left"/>
          <img alt="" src="/img/ownIcon.png" onClick={(event)=>this.selectCategory("own")} className="iconLogo left"/>
        </div>
      )
    } else {
      return (
        <div>
          <img alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
          <img alt="" src="/img/arrowRight.png" onClick={this.showCategories} className="iconLogo left"/>
        </div>
      )
    }
  }
});

export default Categories;