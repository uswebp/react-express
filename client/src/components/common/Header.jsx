/*=======================================================================
 import
=======================================================================*/
import React from 'react';
import history from '../../lib/history';

/*=======================================================================
 class
=======================================================================*/
class Header extends React.Component {
    /**
     * @description コンストラクター
     * @param {} props | ?
     * @returns ×
     */
    constructor(props) {
        super(props);
        this.state = {
        };
    }
/*=======================================================================
 life cycle
=======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
    }

    componentDidMount() {
        // Fetch・DOM操作
    }
/*=======================================================================
 methods
=======================================================================*/
    /**
     * @description ルーティング
     * @param url | 遷移先のパス
     * @returns ×
     */
    routerAction = (url) => {
        let link_path = url.currentTarget.getAttribute('data-num');
        // 遷移
        history.push(link_path);
    }
    // ページ遷移時ソケット情報削除
    socketDct = () => {
        let socket = this.state.socket;
        socket.emit('amputation_socket');
    }

    render() {
        return (
            <header>
                <h1 onClick={this.routerAction} data-num='/'>COODIG</h1>
                <nav>
                    <ul>
                        <li onClick={this.routerAction} data-num='/chat_view'>チャット</li>
                        <li onClick={this.routerAction} data-num='/search'>投稿一覧</li>
                        <li>GitHub</li>
                        <li onClick={this.routerAction} data-num='/contact'>お問い合わせ</li>
                    </ul>
                </nav>
            </header>
        );
    }
};

export default Header;