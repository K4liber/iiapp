import React from 'react';
import { browserHistory } from './App';

import ReactTooltip from 'react-tooltip'

var Categories = React.createClass({
  getInitialState: function() {
    return {
      show: false,
      modalIsOpen: false,
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
          <img alt="" src="/img/arrowLeft.png" onMouseEnter={this.openModal} onClick={this.hideCategories} className="iconLogo left"/>
          <img data-tip="home" alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
          <img data-tip="sport" alt="" src="/img/sportIcon.png" onClick={(event)=>this.selectCategory("sport")} className="iconLogo left"/>
          <img data-tip="science" alt="" src="/img/scienceIcon.png" onClick={(event)=>this.selectCategory("science")} className="iconLogo left"/>
          <img data-tip="people" alt="" src="/img/peopleIcon.png" onClick={(event)=>this.selectCategory("people")} className="iconLogo left"/>
          <img data-tip="politic" alt="" src="/img/politicIcon.png" onClick={(event)=>this.selectCategory("politic")} className="iconLogo left"/>
          <img data-tip="media" alt="" src="/img/mediaIcon.png" onClick={(event)=>this.selectCategory("music")} className="iconLogo left"/>
          <img data-tip="economy" alt="" src="/img/economyIcon.png" onClick={(event)=>this.selectCategory("economy")} className="iconLogo left"/>
          <img data-tip="another" alt="" src="/img/anotherIcon.png" onClick={(event)=>this.selectCategory("another")} className="iconLogo left"/>
          <ReactTooltip />
        </div>
      )
    } else {
      return (
        <div>
          <img data-tip="home" alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
          <img alt="" src="/img/arrowRight.png" onClick={this.showCategories} className="iconLogo left"/>
          <ReactTooltip />
        </div>
      )
    }
  }
});

export default Categories;