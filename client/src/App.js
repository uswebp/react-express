
// Updated. Thanks to: Paul Luna
import React, { Component } from "react";
import { Router, Route } from 'react-router-dom';
import history from './history';
// import PageOne from './PageOne';
import PageTwo from './PageTwo';
import Chat from './Chat';

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      // <div>
      //     <h2>Coodig.com</h2>
      // </div>
      <div>
      <Router history={history}>
        <div>
          <Route path="/" exact component={Chat} />
          <Route path="/action" exact component={PageTwo} />
        </div>
      </Router>
    </div>
    )
  }
}

export default App;