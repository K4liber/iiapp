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
          <img data-tip="hide categories" alt="" src="/img/arrowLeft.png" onClick={this.hideCategories} className="iconLogo left"/>
          <img data-tip="technology category" alt="" src="/img/technologyIcon.png" onClick={(event)=>this.selectCategory("technology")} className="iconLogo left"/>
          <img data-tip="entertainment category" alt="" src="/img/entertainmentIcon.png" onClick={(event)=>this.selectCategory("entertainment")} className="iconLogo left"/>
          <img data-tip="science category" alt="" src="/img/scienceIcon.png" onClick={(event)=>this.selectCategory("science")} className="iconLogo left"/>
          <img data-tip="people category" alt="" src="/img/peopleIcon.png" onClick={(event)=>this.selectCategory("people")} className="iconLogo left"/>
          <img data-tip="politic category" alt="" src="/img/politicIcon.png" onClick={(event)=>this.selectCategory("politic")} className="iconLogo left"/>
          <img data-tip="media category" alt="" src="/img/mediaIcon.png" onClick={(event)=>this.selectCategory("media")} className="iconLogo left"/>
          <img data-tip="economy category" alt="" src="/img/economyIcon.png" onClick={(event)=>this.selectCategory("economy")} className="iconLogo left"/>
          <img data-tip="another category" alt="" src="/img/anotherIcon.png" onClick={(event)=>this.selectCategory("another")} className="iconLogo left"/>
          <ReactTooltip />
        </div>
      )
    } else {
      return (
        <div>
          <img data-tip="home" alt="" src="/img/homeIcon.png" onClick={this.goHome} className="iconLogo left"/>
          <img data-tip="show categories" alt="" src="/img/arrowRight.png" onClick={this.showCategories} className="iconLogo left"/>
          <ReactTooltip />
        </div>
      )
    }
  }
});

export default Categories;