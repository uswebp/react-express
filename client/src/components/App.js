// Updated. Thanks to: Paul Luna +
import React, { Component } from "react";
import { Router, Route } from 'react-router-dom';
import history from '../lib/history';
import Article from './Article';
import Chat from './Chat';
import LinkTest from './LinkTest';
import SocketBug from './SocketBug';

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Router history={history}>
          <div>
            <Route path="/" exact component={Chat} />
            <Route path="/article" exact component={Article} />
            <Route path="/linktest" exact component={LinkTest} />
            <Route path="/soket_bug" exact component={SocketBug} />
          </div>
        </Router>
    </div>
    )
  }
}

export default App;