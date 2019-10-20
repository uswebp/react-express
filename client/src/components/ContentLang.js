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

    componentWillMount() {
        this.setState({ langId: this.props.propsLangId })
    }

    render() {

        console.log(this.state.langId)

        return (
            <div>
                <p key={ this.state.langId }>{this.state.langId}</p>
            </div>
        )
    }
}
export default ContentLang