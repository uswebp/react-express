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
        let window_w = window.innerWidth;
        // スマホのみハンバーガーメニューを操作
        if (window_w < 800) {
            let header_nav = document.querySelector('header nav');
            let mob_hide_box = document.querySelector('.mob-hide-box');
            header_nav.style.transform = 'translate(-250px)';
            mob_hide_box.style.display = 'none';
        }
        // 遷移
        let link_path = url.currentTarget.getAttribute('data-num');
        history.push(link_path);
    }
    openMenu = () => {
        let header_nav = document.querySelector('header nav');
        let mob_hide_box = document.querySelector('.mob-hide-box');
        header_nav.style.transform = 'translate(0)';
        mob_hide_box.style.display = 'block';
    }
    closeMenu = () => {
        let header_nav = document.querySelector('header nav');
        let mob_hide_box = document.querySelector('.mob-hide-box');
        header_nav.style.transform = 'translate(-250px)';
        mob_hide_box.style.display = 'none';
    }

    render() {
        return (
            <header>
                <div className="mob-humb-menu" onClick={this.openMenu}>
                    <div className="mob-humb-inner">
                        <span className="humb-line"></span>
                    </div>
                </div>
                <h1 onClick={this.routerAction} data-num='/'>COODIG</h1>
                <nav>
                    <ul>
                        <li onClick={this.routerAction} data-num='/chat_view'>チャット</li>
                        <li onClick={this.routerAction} data-num='/search'>投稿一覧</li>
                        <li>GitHub</li>
                        <li onClick={this.routerAction} data-num='/contact'>お問い合わせ</li>
                    </ul>
                </nav>
                <div className='mob-hide-box' onClick={this.closeMenu}></div>
            </header>
        );
    }
};

export default Header;