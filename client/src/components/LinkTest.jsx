import React, { Component } from "react";
import ContentLang from "./ContentLang";
import EventListener from 'react-event-listener';
import socketIOClient from "socket.io-client";
import df from '../config/define';

class LinkTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SCREEN_HEIGHT:  window.parent.screen.height,
            SCREEN_WIDTH: window.parent.screen.width,
            BROWSER_HEIGHT:window.innerHeight,
            BROWSER_WIDTH:window.innerWidth,
            recentlyLangs: [],
            TAG_WIDTH:"",
            TAG_HEIGHT:"",
            TR_NUM:"",
            TD_NUM:"",
            TABLE_SIZE_WIDTH:"",
            TABLE_SIZE_HEIGHT:"",
            socketID: '',
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
        };
    }
    
    componentDidMount() {
        let socket = this.state.socket;
        // this.setSocketID(data.socket_id);
        // console.log(this.state.socketID);
        console.log('Ok');

        socket.on("emit_from_server_id", (data) => {
            // socket.idをセット
            console.log(data);
        });
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
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/getRecentlyLang')
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
      // SocketIDセット
    setSocketID = (data) => {
        this.setState({ socketID: data });
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