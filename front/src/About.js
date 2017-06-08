import React from 'react';

import { host } from './App.js';
import { lock } from './App.js';
import { browserHistory } from './App.js';

var About = React.createClass({
  getInitialState: function() {
    return {
      result: null,
    }
  },
  showLock: function() {
      browserHistory.push("/");
      lock.show();
  },
  render: function() {
      return (
          <div className="row">
            <div className="contentLeft col-md-12" id="contentLeft">
              <div className="maginTop10">
              </div>
              <img className="memImage" alt="ASAS" src={host + "/resources/aboutPage.png"}/>
              <div className="commentSignature" onClick={this.goToIdea}>
                What is this page about?
              </div>
              <div className="comments">
                <div className="center">
                  <div>
                    <p>Visionaries is an educational platform.</p>
                    <p>You can find here interesting articles and learn something new.</p>
                    <p>Anyone can add an article.</p>
                    <p>All content is public so everybody can read, comment and like articles.</p>
                    <p>If you want to be an active user, please:</p>
                  </div>
                  <div><button className="btn btn-primary" onClick={this.showLock}>sign up</button></div>
                  <div style={{ marginBottom: "5%" }}>
                    <p>This is our beginning, hope you will follow and support our development.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
     }
});

export default About;