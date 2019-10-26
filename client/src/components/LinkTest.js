import React, { Component } from "react";
import ContentLang from "./ContentLang";
import EventListener from 'react-event-listener';

class LinkTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SCREEN_HEIGHT: "",
            SCREEN_WIDTH: "",
            BROWSER_HEIGHT:"",
            BROWSER_WIDTH:"",
            recentlyLangs: [],
            TAG_WIDTH:"",
            TAG_HEIGHT:"",
            TR_NUM:"",
            TD_NUM:"",
            TABLE_SIZE_WIDTH:"",
            TABLE_SIZE_HEIGHT:""
        };
    }
    
    componentDidMount() {
        this.setState({ SCREEN_HEIGHT: window.parent.screen.height });
        this.setState({ SCREEN_WIDTH: window.parent.screen.width });
        this.setState({ BROWSER_WIDTH: window.innerWidth });
        this.setState({ BROWSER_HEIGHT: window.innerHeight });
        this.setState({ TABLE_SIZE_WIDTH: window.innerWidth * 0.9 });
        this.setState({ TABLE_SIZE_HEIGHT: window.innerHeight * 0.9});
        this.setState({ TAG_WIDTH: (window.innerWidth * 0.9) * 0.1 });
        this.setState({ TAG_HEIGHT: (window.innerWidth * 0.9) * 0.1});
        this.setState({ TR_NUM: window.innerWidth * 0.9 / ((window.innerWidth * 0.9) * 0.1) });
        this.setState({ TD_NUM: window.innerHeight * 0.9 / ((window.innerWidth * 0.9) * 0.1)});
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
    // 画面リサイズ
    handleResize = () => {
        this.setState({ BROWSER_HEIGHT: window.innerWidth });
        this.setState({ BROWSER_WIDTH: window.innerHeight });
        console.info(
          `window height:width=${this.state.BROWSER_HEIGHT}:${this.state.BROWSER_WIDTH}`,
        );
      };
      
    render() {
        const {recentlyLangs} = this.state;
        return (
            <div id="main">
                { recentlyLangs.map((langs) => {
                    return (
                        <div key={langs.p_lang_id}>
                            <ContentLang propsLangId={langs.p_lang_id} key={langs.p_lang_id}/>
                        </div>
                    )
                })}
                <EventListener target="window" onResize={this.handleResize} />
            </div>
        )
    }
}

export default LinkTest