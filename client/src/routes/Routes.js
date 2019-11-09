// Updated. Thanks to: Paul Luna +
import React, { Component } from "react";
import { Router, Route } from 'react-router-dom';
import history from '../lib/history';
import Article from '../components/Article.jsx';
import Chat from '../components/Chat.jsx';
import LinkTest from '../components/LinkTest.jsx';
import SocketBug from '../components/SocketBug.jsx';
import Cell from '../components/Cell.jsx';

class Routes extends Component {
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
                        <Route path="/cell" exact component={Cell} />
                    </div>
                </Router>
          </div>
        )
    }
}

export default Routes;