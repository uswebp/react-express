import React, { Component } from "react";
import ContentLang from "./ContentLang";

class LinkTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SCREEN_HEIGHT: "",
            SCREEN_WIDTH: "",
            recentlyLangs: []
        };
    }

    componentDidMount() {
        this.setState({ SCREEN_HEIGHT: window.parent.screen.height });
        this.setState({ SCREEN_WIDTH: window.parent.screen.width });

        this.getLangId();

    }

    // 最近投稿された言語idを取得するAPI呼び出し
    getLangId = () => {
        fetch('http://192.168.33.11:5000/getRecentlyLang')
            .then(response => response.json())
            .then((data) => {
                this.setRecently(data);
            })
            .catch(err => console.err(err));
    }

    // 最新10件をstateにset
    setRecently = (data) => {
        this.setState({ recentlyLangs: data.recently_p_langs });
    }

    render() {

        const {recentlyLangs} = this.state;

        return (
            <div id="main">
                {/* <p>{console.log(this.state.SCREEN_HEIGHT)}</p> */}
                {/* <p>{console.log(this.state.SCREEN_WIDTH)}</p> */}

                { recentlyLangs.map((langs) => {
                    return (
                        <ContentLang propsLangId={langs.p_lang_id} />
                    )
                })}
            </div>
        )
    }
}

export default LinkTest