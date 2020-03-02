import React, { Component } from "react";

class ContentLang extends Component {
    // props初期化
    constructor(props) {
        super(props);
        this.state = {
            LANG_NAME: '',
            TRIVIA_ID: '',
            COLOR_CODE: '',
            ARTICLE: '',
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({ LANG_NAME: this.props.lang_name });
        this.setState({ TRIVIA_ID: this.props.trivia_id });
        this.setState({ COLOR_CODE: this.props.color_code });
        this.setState({ ARTICLE: this.props.article });
    }

    render() {
        return (
            <div>
                <div>
                <h2>{this.state.LANG_NAME}</h2>
                <div>{this.state.ARTICLE}</div>
                </div>
            </div>
        )
    }
}

export default ContentLang