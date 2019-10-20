
// Updated. Thanks to: Paul Luna
import React, { Component } from "react";
import { Router, Route } from 'react-router-dom';
import history from './history';
import Article from './Article';
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
          <Route path="/article" exact component={Article} />
        </div>
      </Router>
    </div>
    )
  }
}

export default App;