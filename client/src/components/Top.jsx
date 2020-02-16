import React from 'react';
import history from '../lib/history';
import df from '../config/define';
import socketIOClient from "socket.io-client";

class Top extends React.Component {
    constructor() {
        super();
        this.state = {
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
            TRIVIA: [],
        }
    }
    componentDidMount() {
        this.getRecentlyLang();
        // Socket切断
        this.socketDct();
    }
    routerAction = (url) => {
        let link_path = url.currentTarget.getAttribute('data-num');
        // Socket切断
        this.socketDct();
        // 遷移
        history.push(link_path);
    }
    // ページ遷移時ソケット情報削除
    socketDct = () => {
        let socket = this.state.socket;
        socket.emit('amputation_socket');
    }
    /**
     * @description 豆知識取得
     * @returns ×
     */
    getRecentlyLang = () => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/recently_lang/')
            .then(response => response.json())
            .then((data) => {
                this.setTrivia(data);
            })
            .catch(err => console.error(err))
    }
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.p_lang });
    }

    render() {
        let p_lang_detail = this.state.TRIVIA;
        let p_lang_list = [];
        let p_lang_class = ['first-tag top-view-tag', 'secound-tag top-view-tag', 'third-tag top-view-tag', 'force-tag top-view-tag'];
        for (let i in p_lang_detail) {
            p_lang_list.push(<div key={p_lang_detail[i].p_lang_id} className={p_lang_class[i]} style={{background:'#' + p_lang_detail[i].p_lang_color_code}} value={p_lang_detail[i].p_lang_id}><span className="top-p-lang">{p_lang_detail[i].p_lang_name}</span></div>);
        }

        return (
            <div className="top-area">
                <div className="top-area-inner">
                    <div className="main-container">
                        <div className="top-left-col">
                            <div className="title-log">
                                <h1>CoodiG</h1>
                            </div>
                            <div className="top-tag-area">
                                {p_lang_list}
                            </div>
                        </div>
                        <div className="top-right-col">
                            <div className="page-detail">
                                <p>
                                    テストテストテストテストテストテストテストテストテストテストテスト
                                    テストテストテストテストテストテストテストテストテストテストテスト
                                    テストテストテストテストテストテストテストテストテストテストテスト
                                    テストテストテストテストテストテストテストテストテスト
                                </p>
                                {/* <div className="page-detail-foot-line">|</div> */}
                            </div>
                            <div className="top-btn-area">
                                <div className="chat-btn"><button onClick={this.routerAction} data-num='/chat_view' className="btn-basic btn-02">チャット</button></div>
                                <div className="article-btn"><button onClick={this.routerAction} data-num='/search' className="btn-basic btn-02">投稿一覧</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Top;