
// Updated. Thanks to: Paul Luna
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LinkTest from './components/LinkTest';
import NavigateBar from "./components/NavigateBar";
import Chat from "./Chat";

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Router>
      <div>
        <NavigateBar /><hr/>
        <h2>Coodig.com</h2>
          <Route exact path='/' component={Chat}/>
          <Route path='/LinkTest' component={LinkTest}/>
      </div>
      </Router>
      
    )
  }
}

export default App;