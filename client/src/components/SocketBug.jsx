import React, { Component } from "react";
import { Link } from 'react-router-dom';
// import history from '../lib/history';

class SocketBug extends Component {
    // props初期化
    constructor() {
        super();
        this.state = {
        };
        
    }

    UNSAFE_componentWillMount() {
    }
    componentDidMount() {
    }

    render() {
        console.log(this.state);
        return (
            <div>
                 <p><Link to="/">戻る</Link></p>
            </div>
        )
    }
}
export default SocketBug