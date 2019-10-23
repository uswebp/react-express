import React, { Component } from "react";

class ContentLang extends Component {
    // props初期化
    constructor(props) {
        super(props);
        this.state = {
            langId: "",
            test: "",
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({ langId: this.props.propsLangId })
    }

    render() {
        // console.log(this.state.langId)
        return (
            <div>
                <p>{this.state.langId}</p>
            </div>
        )
    }
}
export default ContentLang