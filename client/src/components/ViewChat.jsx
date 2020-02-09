/*=======================================================================
 import
=======================================================================*/
import React, { Component } from "react";
import EventListener from 'react-event-listener';
import df from '../config/define';
import socketIOClient from "socket.io-client";

/*=======================================================================
 class
=======================================================================*/
class ViewChat extends Component {
    /**
     * @description コンストラクター
     * @param {} props | ?
     * @returns ×
     */
    constructor(props) {
        super(props);
        this.state = {
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
            TABLE_SIZE_WIDTH: 0,
            TABLE_SIZE_HEIGHT: 0,
            TAG_NUM: 0,
            TAG_SIZE: 0,
            TR_NUM: 0,
            TD_NUM: 0,
            TOTAL_TD: 0,
            TAG_RANDUM_ARR: [],
            TRIVIA: [],
            FONT_SIZE: 10,
        };
    }

    /*=======================================================================
     life cycle
    =======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
        this.calculateTable();
    }

    componentDidMount() {
        let socket = this.state.socket;
        let total_td = this.state.TOTAL_TD;

        // 豆知識送信後、レスポンス受信処理
        socket.on("emit_from_server_trivia", (data) => {

            let tag_size = this.state.TAG_SIZE;
            let ary_trivia_tags = document.querySelectorAll('.trivia-tag');

            let delete_trivia_tag_id = this.getMinNum(ary_trivia_tags);
            let delete_trivia_tag = document.querySelector('.tag-id-' + delete_trivia_tag_id);
            let td_num = delete_trivia_tag.getAttribute('current-td-num');
            let parent_td = document.querySelector('.td-id-' + td_num);

            // タグ削除
            while (parent_td.firstChild) parent_td.removeChild(parent_td.firstChild);

            this.createTag(data.trivia_id, td_num, data.p_lang_name, data.p_lang_color, parent_td);

            this.setAnimation(data.trivia_id, data.p_lang_name, decodeURIComponent(data.article), tag_size, data.p_lang_color);
        });

        socket.on('trivia_sending', () => {
            let send_button_pc = document.querySelector('.send-btn-area-pc .send-btn');
            let send_button_mob = document.querySelector('.send-btn-area-mob .send-btn');
            send_button_pc.classList.add('btn-disable');
            send_button_mob.classList.add('btn-disable');
            send_button_pc.disabled = true;
            send_button_mob.disabled = true;
        });

        // Fetch・DOM操作
        this.installationGetTag(total_td);
        this.getPcolor();
    }
    /*=======================================================================
     methods
    =======================================================================*/


    createTag = (trivia_id, td_num, p_lang_name, p_lang_color_code, parent_td) => {
        let div = document.createElement('div');
        let span = document.createElement('span');

        // タグを生成後、配置
        div.classList.add('trivia-tag');
        div.classList.add('tag-id-' + trivia_id);
        div.setAttribute('current-td-num', td_num);
        span.classList.add('trivia-name');
        // プログラミング言語セット
        parent_td.appendChild(div).appendChild(span).innerText = p_lang_name;
        // プログラミング言語カラーセット
        parent_td.querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;
    }

    setMoveAnimation = (trivia_tag, animation_kind, send_flag) => {
        let animation_move_sec = Math.floor((Math.random() * 10) + 6);

        trivia_tag.addEventListener('animationend', function () {
            if (send_flag) {
                let send_button = document.getElementById('send-btn');
                let trivia_txt = document.querySelector('.chat-area-tag');

                send_button.disabled = false;
                trivia_txt.value = '';
                send_button.classList.remove('btn-disable');
            }
            trivia_tag.style.animationName = '';
            trivia_tag.classList.add(animation_kind);
            trivia_tag.classList.add('view_end');
            trivia_tag.style.animationIterationCount = 'infinite';
            trivia_tag.style.animationDuration = animation_move_sec + 's';
            trivia_tag.style.animationDirection = 'alternate';
            trivia_tag.style.webkitTransition = 'all 0.5s ease-in-out';
        });
        return trivia_tag;
    }

    setAnimation = (trivia_id, p_lang_name, article, tag_size, p_lang_color_code) => {
        let animation_kind = this.getAnimation();
        let send_flag = true;
        let trivia_tag = this.setTagStyles(document.querySelector('.tag-id-' + trivia_id), tag_size);

            let trivia_txt = document.querySelector('.chat-area-tag');
            let send_button_pc = document.querySelector('.send-btn-area-pc .send-btn');
            let send_button_mob = document.querySelector('.send-btn-area-mob .send-btn');
            send_button_pc.disabled = false;
            send_button_mob.disabled = false;
            trivia_txt.value = "";
            send_button_pc.classList.remove('btn-disable');
            send_button_mob.classList.remove('btn-disable');

        trivia_tag = this.setMoveAnimation(trivia_tag, animation_kind, send_flag);

        trivia_tag.addEventListener('click', function (e) {
            // 描画が終了していれば
            if (trivia_tag.classList.contains('view_end')) {
                let current_td_num = trivia_tag.getAttribute('current-td-num');
                let temp = document.querySelector('.temp');
                let temp_text = temp.innerText;

                // モーダルの要素をクラス名で取得↑みたいな
                let post_area = document.querySelector('.post-area');
                let modal_hide = document.querySelector('.hide-box');

                // 書き込む要素取得
                let modal_span = document.querySelector('.p-lang-span');
                let modal_article_txt = document.querySelector('.modal-article-txt');

                if (!temp_text) {
                    temp.innerText = current_td_num;

                    // モーダル表示ON
                    modal_hide.style.display = 'block';
                    post_area.style.display = 'block'

                    // innerTextでtag_contentの中身を取得したモーダルの要素に書き込み
                    modal_span.innerText = p_lang_name;
                    modal_span.style.borderColor = '#' + p_lang_color_code;
                    modal_article_txt.innerText = article;

                } else {
                    temp.innerText = '';
                    modal_hide.style.display = 'none';
                    post_area.style.display = 'none';
                }
            }
        });
    }

    setTagStyles = (trivia_tag, tag_size) => {
        // 開始ポジション
        let pos_x = Math.floor(Math.random() * (tag_size * 0.5));
        let pos_y = Math.floor(Math.random() * (tag_size * 0.5));
        // アニメーション
        let animation_view_sec = Math.floor((Math.random() * 5) + 3);
        // スタイルセット
        trivia_tag.style.webkitTransitionProperty = "-webkit-transform";
        trivia_tag.style.webkitTransitionProperty = "all";
        trivia_tag.style.webkitTransitionDelay = "0.2s";
        trivia_tag.style.webkitTransitionDuration = "0.5s";
        trivia_tag.style.webkitTransitionTimingFunction = "ease-in-out";

        trivia_tag.style.position = 'absolute';
        trivia_tag.style.top = pos_x + 'px';
        trivia_tag.style.left = pos_y + 'px';
        trivia_tag.style.width = tag_size + 'px';
        trivia_tag.style.height = tag_size + 'px';
        trivia_tag.style.animation = 'tagview ' + animation_view_sec + 's 1';

        return trivia_tag;
    }

    // アニメーション振り分け
    getAnimation = () => {
        let animation_kind = '';
        let animation_val = Math.floor(Math.random() * 10);
        switch (animation_val) {
            case 0: animation_kind = 'tag_move_0';
                break;
            case 1: animation_kind = 'tag_move_1';
                break;
            case 2: animation_kind = 'tag_move_2';
                break;
            case 3: animation_kind = 'tag_move_3';
                break;
            case 4: animation_kind = 'tag_move_4';
                break;
            case 5: animation_kind = 'tag_move_5';
                break;
            case 6: animation_kind = 'tag_move_6';
                break;
            case 7: animation_kind = 'tag_move_7';
                break;
            case 8: animation_kind = 'tag_move_8';
                break;
            case 9: animation_kind = 'tag_move_9';
                break;
            default: animation_kind = 'tag_move_0';
                break;
        }
        return animation_kind;
    }

    // 最小値を返す
    getMinNum = (ary_trivia_tags) => {
        let ary_tag_ids = [];
        let delete_trivia_tag_id = 0;

        // 全tag-idを取得して数字部分のみを配列に
        for (let trivia_tag of ary_trivia_tags) {
            // tag_id取得
            let ary_tag_classes = trivia_tag.className.split(' ');
            let tag_id = ary_tag_classes[1];
            // 数字だけ抽出
            tag_id = tag_id.replace(/[^0-9]/g, '');
            ary_tag_ids.push(tag_id);
        }
        // 表示されてる中で一番小さい（古い）tag_idを取得
        for (let tag_num of ary_tag_ids) {
            if (delete_trivia_tag_id === 0) {
                delete_trivia_tag_id = tag_num;
            } else if (delete_trivia_tag_id > tag_num) {
                delete_trivia_tag_id = tag_num;
            }
        }
        return delete_trivia_tag_id;
    }

    getTdTr = (table_size_width, table_size_height) => {
        let td_num, tr_num = 0;

        // td数
        if (table_size_width < 450) {
            td_num = 3;
        } else if (table_size_width >= 450 && table_size_width < 600) {
            td_num = 3;
        } else if (table_size_width >= 600 && table_size_width < 700) {
            td_num = 4;
        } else if (table_size_width >= 600 && table_size_width < 700) {
            td_num = 5;
        } else if (table_size_width >= 700 && table_size_width < 800) {
            td_num = 5;
        } else if (table_size_width >= 800 && table_size_width < 900) {
            td_num = 6;
        } else if (table_size_width >= 900 && table_size_width < 1000) {
            td_num = 7;
        } else if (table_size_width >= 1000 && table_size_width < 1200) {
            td_num = 8;
        } else if (table_size_width >= 1200 && table_size_width < 1400) {
            td_num = 9;
        } else if (table_size_width >= 1400) {
            td_num = 10;
        }
        // tr数
        if (table_size_height < 450) {
            tr_num = 3;
        } else if (table_size_height >= 450 && table_size_height < 600) {
            tr_num = 4;
        } else if (table_size_height >= 600 && table_size_height < 700) {
            tr_num = 5;
        } else if (table_size_height >= 700 && table_size_height < 800) {
            tr_num = 5;
        } else if (table_size_height >= 800 && table_size_height < 900) {
            tr_num = 5;
        } else if (table_size_height >= 900 && table_size_height < 1000) {
            tr_num = 6;
        } else if (table_size_height >= 1000 && table_size_height < 1100) {
            tr_num = 7;
        } else if (table_size_height >= 1100) {
            tr_num = 7;
        }
        return { td_num, tr_num };
    }

    // 言語情報取得
    getPcolor = () => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/p_lang_color')
            .then(response => response.json())
            .then((data) => {
                this.setPcolor(data);
            })
            .catch(err => console.error(err))
    }

    /**
     * @description テーブル計算
     * @param ×
     * @returns ×
     */
    calculateTable = () => {
        // テーブルサイズ
        let table_size_width = Math.floor(window.innerWidth * 0.9 / 10) * 10;
        let table_size_height = Math.floor(window.innerHeight * 0.7 / 10) * 10;
        // 初期値
        let tag_size = 0;
        let font_size = 0;
        let { td_num, tr_num } = this.getTdTr(table_size_width, table_size_height);

        // タグ関係
        let tag_width = (table_size_width / td_num) * 0.62;
        let tag_height = (table_size_height / tr_num) * 0.62;
        let tag_num = Math.floor((td_num * tr_num) * 0.8);
        // カラム総数
        let total_td = td_num * tr_num;
        // タグサイズ小さい方を採用(縦<>横)
        if (tag_width >= tag_height) {
            tag_size = Math.floor(tag_height);
        } else {
            tag_size = Math.floor(tag_width);
        }
        // カラム総数によってフォントサイズ変更
        if (total_td >= 50) {
            font_size = 12;
        } else if (total_td >= 40) {
            font_size = 11;
        } else if (total_td >= 30) {
            font_size = 10;
        } else if (total_td >= 20) {
            font_size = 8;
        } else if (total_td >= 18) {
            font_size = 7;
        } else if (total_td >= 15) {
            font_size = 7;
        } else if (total_td >= 10) {
            font_size = 6;
        } else {
            font_size = 5;
        }
        // stateに値をセット
        this.setState({ TD_NUM: td_num });
        this.setState({ TR_NUM: tr_num });
        this.setState({ TOTAL_TD: total_td });
        this.setState({ TAG_SIZE: tag_size });
        this.setState({ TAG_NUM: tag_num });
        this.setState({ TABLE_SIZE_WIDTH: table_size_width });
        this.setState({ TABLE_SIZE_HEIGHT: table_size_height });
        this.setState({ FONT_SIZE: font_size });
        // 初回のDOM操作を回避
        if (this.state.TAG_RANDUM_ARR.length !== 0) {
            this.installationGetTag(total_td);
        }
    }
    /**
     * @description TD数の乱数配列を取得⇒タグをランダム配置
     * @param {Int} total_td | TDの総数
     * @returns ×
     */
    installationGetTag = (total_td) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/tagrandum/' + total_td)
            .then(response => response.json())
            .then((data) => {
                let trivia_num = this.state.TAG_NUM;
                let randum = data.randum;
                // 豆知識取得
                this.getTrivia(randum, trivia_num);
            })
            .catch(err => console.error(err))
    }
    /**
     * @description 豆知識取得
     * @param {Array} randum | 乱数配列
     * @param {Int} trivia_num | 取得する豆知識の個数
     * @returns ×
     */
    getTrivia = (randum, trivia_num) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/trivia/' + trivia_num)
            .then(response => response.json())
            .then((data) => {
                let tag_size = this.state.TAG_SIZE;
                let tag_num = this.state.TAG_NUM;
                let randum_array = randum;
                let trivia = data.trivia;
                // タグを生成
                this.tagGeneration(tag_size, randum_array, tag_num, trivia);
                // 乱数配列をセット
                this.setTagNum(randum);
                this.setTrivia(data);
            })
            .catch(err => console.error(err))
    }

    // 言語カラーセット
    setPcolor = (data) => {
        this.setState({ p_lang_color: data.color });
    }
    /**
     * @description タグの乱数をstateにセット
     * @param {Array} randum | 乱数配列
     * @returns ×
     */
    setTagNum = (randum) => {
        this.setState({ TAG_RANDUM_ARR: randum });
    }
    /**
     * @description 豆知識をstateにセット
     * @param {Object} data | 豆知識
     * @returns ×
     */
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.trivia });
    }

    onClickTag = (trivia_tag, tag_content, font_size, ) => {
        trivia_tag.addEventListener('click', function (e) {
            // 描画が終了していれば
            if (trivia_tag.classList.contains('view_end')) {
                // console.log(trivia_tag.getAttribute('current-td-num'));

                let current_td_num = trivia_tag.getAttribute('current-td-num');

                let temp = document.querySelector('.temp');
                let temp_text = temp.innerText;

                // tag_contentの中身取得
                let p_lang_name = tag_content[0];
                let trivia_id = tag_content[1];
                let p_lang_color_code = tag_content[2];
                let article = tag_content[3];

                // モーダルの要素をクラス名で取得↑みたいな
                let post_area = document.querySelector('.post-area');
                let modal_hide = document.querySelector('.hide-box');

                // 書き込む様相取得
                let modal_p_lang = document.querySelector('.modal-p-lang');
                let modal_span = document.querySelector('.modal-p-lang h2.p-lang-span');
                let modal_article_txt = document.querySelector('.modal-article-txt');
                console.log(modal_p_lang);

                if (!temp_text) {
                    temp.innerText = current_td_num;

                    // モーダル表示ON
                    modal_hide.style.display = 'block';
                    post_area.style.display = 'block'

                    // innerTextでtag_contentの中身を取得したモーダルの要素に書き込み
                    modal_span.innerText = p_lang_name;
                    modal_span.style.borderColor = '#' + p_lang_color_code;
                    modal_article_txt.innerText = article;

                } else {
                    temp.innerText = '';
                    modal_hide.style.display = 'none';
                    post_area.style.display = 'none';
                }
            }
        });
    }

    /**
 * @description 投稿エリア非表示
 * @param ×
 * @returns ×
 */
    closeModal = () => {
        let modal_hide = document.querySelector('.hide-box');
        let post_area = document.querySelector('.post-area');

        let temp = document.querySelector('.temp');
        temp.innerText = '';

        // 送信エリア非表示
        modal_hide.style.display = 'none';
        post_area.style.display = 'none';
    }

    /**
     * @description テーブルを生成
     * @param {Int} d | TD数
     * @param {Int} r | TR数
     * @returns {String} table | tableを生成するHTMLの文字列
     */
    renderTable = (d, r) => {
        /* 初期値 */
        //tableサイズ
        let table_width = this.state.TABLE_SIZE_WIDTH;
        let table_height = this.state.TABLE_SIZE_HEIGHT;
        //trサイズ
        let tr_width = table_width;
        let tr_height = Math.floor(table_height / r);
        //tdサイズ
        let td_width = Math.floor(table_width / d) - 2;
        let td_height = tr_height;

        // テーブル
        let table = "<table width= '" + table_width + "' height='" + table_height + "' class='trvia-table'>";
        let num = 0;
        // tr生成
        for (let i = 0; i < r; i++) {
            table += "<tr width= '" + tr_width + "' height= '" + tr_height + "' class='trvia-tr tr-id-" + i + "'>";
            // td生成
            for (let j = 0; j < d; j++) {
                table += "<td width= '" + td_width + "' height= '" + td_height + "' class='trvia-td td-id-" + num + "'></td>";
                num++;
            }
            table += "</tr>";
        }
        table += "</table>";

        return table;
    }
    /**
     * @description タグを生成
     * @param {Int} tag_size | タグサイズ
     * @param {Array} randum_array | 乱数配列
     * @param {Int} tag_num | 出力タグ数
     * @param {Object} trivia | 豆知識
     * @returns ×
     */
    tagGeneration = (tag_size, randum_array, tag_num, trivia) => {
        // 乱数配列が存在する場合
        if (randum_array) {
            // td取得
            let trivia_td = document.querySelectorAll('.trvia-td');
            // 豆知識のカラム数
            let trivia_td_len = trivia_td.length;
            // 乱数配列の長さ
            let randum_ary_len = randum_array.length;
            // 全てのタグをリセット
            for (let i = 0; i < trivia_td_len; i++) {
                while (trivia_td[i].firstChild) {
                    trivia_td[i].removeChild(trivia_td[i].firstChild);
                }
            }
            // 総TD数と乱数配列の数の整合性チェック
            if (trivia_td_len === randum_ary_len) {
                let tag_content = [];
                // タグをランダムに設置
                for (let i = 0; i < trivia_td_len; i++) {
                    // タグの個数分ループ
                    if (i === tag_num) {
                        break;
                    }
                    // 乱数取り出し
                    let randum_num = randum_array[i];

                    // 豆知識情報セット
                    tag_content[i] = [];
                    tag_content[i].push(trivia[i].p_lang_name);
                    tag_content[i].push(trivia[i].trivia_id);
                    tag_content[i].push(trivia[i].p_lang_color_code);
                    tag_content[i].push(trivia[i].article);
                    tag_content[i].push(randum_num);

                    // タグを生成後、配置
                    let div = document.createElement('div');
                    let span = document.createElement('span');
                    div.classList.add('trivia-tag');
                    div.classList.add('tag-id-' + trivia[i].trivia_id);
                    div.setAttribute('current-td-num', randum_num);
                    span.classList.add('trivia-name');
                    // プログラミング言語セット
                    trivia_td[randum_num].appendChild(div).appendChild(span).innerText = trivia[i].p_lang_name;
                    // プログラミング言語カラーセット
                    trivia_td[randum_num].querySelector('.trivia-tag').style.backgroundColor = '#' + trivia[i].p_lang_color_code;
                }
                // 生成した後タグを取得
                let ary_trivia_tags = document.querySelectorAll('.trivia-tag');
                // タグにスタイル適応
                this.tagStyleAddition(ary_trivia_tags, tag_size, tag_content);
            }
        }
    }
    /**
     * @description タグのスタイル適応処理(CSSアニメーション振り分け含む)
     * @param {Object} trivia_tag | 生成された豆知識タグ要素
     * @param {Int} tag_size | タグの大きさ
     * @returns ×
     */
    tagStyleAddition = (ary_trivia_tags, tag_size, tag_content) => {
        // スタイル適応繰り返し
        for (let i = 0, len = ary_trivia_tags.length; i < len; i++) {

            let animation_kind = this.getAnimation();
            let trivia_tag = this.setTagStyles(ary_trivia_tags[i], tag_size);

            tag_content[i].push(animation_kind);

            trivia_tag = this.setMoveAnimation(trivia_tag, animation_kind);

            let font_size = this.state.FONT_SIZE;
            let trivia_td = document.querySelectorAll('.trvia-td');
            trivia_tag = trivia_td[tag_content[i][4]].querySelector('.trivia-tag');

            this.onClickTag(trivia_tag, tag_content[i], font_size);
        }
    }

    // 豆知識送信
    sendTrivia = (e) => {
        // イベントキャンセル
        e.preventDefault();

        let socket = this.state.socket;

        socket.emit('trivia_send_sign');

        let trivia_txt = document.querySelector('.chat-area-tag').value;
        let p_lang_ids = document.querySelector('.p_lang_color');
        let idx = p_lang_ids.selectedIndex;
        let p_lang_id = p_lang_ids.options[idx].value;

        // [/] をエスケープ
        trivia_txt = encodeURIComponent(trivia_txt);


        let trivia_data = {
            article: trivia_txt,
            p_lang_id: p_lang_id
        }

        socket.emit('send_trivia', trivia_data);

        // trivia_txt.innerText = '';
    }
    // 任意にソケット情報削除
    socketDct = () => {
        let socket = this.state.socket;
        socket.emit('amputation_socket');
    }
    // 任意にソケット接続
    socketCon = () => {
        let socket = this.state.socket;
        console.log('setuzoku_front');
        socket.emit('test');
    }
    render() {
        // TD・TR数に応じてテーブル作成
        let d = this.state.TD_NUM;
        let r = this.state.TR_NUM;
        const MAIN_TABLE = this.renderTable(d, r);


        // 言語セレクトメニュー
        let list = [];
        let p_color_list = this.state.p_lang_color;
        for (let i in p_color_list) {
            list.push(<option key={p_color_list[i].p_lang_id} value={p_color_list[i].p_lang_id}>{p_color_list[i].p_lang_name}</option>);
        }
        return (
            <div id="main">
                <div dangerouslySetInnerHTML={{ __html: MAIN_TABLE }} />
                <EventListener target="window" onResize={this.calculateTable} />
                <div className="send-area">
                    <form className="container" onSubmit={this.sendTrivia}>
                        <div className="send-left-col">
                            <div className="sel-area">
                                <select name="p_lang_color" className="p_lang_color sel-list">
                                    {list}
                                </select>
                                <span className="p-sel-highlight"></span>
                                <span className="p-sel-selectbar"></span>
                                <div className="send-btn-area-pc">
                                    <input type="submit" id="send-btn" className="send-btn btn-basic btn-02"/>
                                </div>
                            </div>
                        </div>
                        <div className="send-right-col">
                            <textarea maxLength="150" cols="80" rows="2" placeholder="プログラムに関する豆知識を入力してください。"　required className="chat-area-tag" />
                            <span className="t-txt-highlight"></span>
                            <span className="t-txt-selectbar"></span>
                        </div>
                        <div className="send-btn-area-mob">
                            <input type="submit" id="send-btn" className="send-btn btn-basic btn-02"/>
                        </div>
                    </form>

                </div>
                <span className='temp' hidden></span>
                <div className="post-area">
                    <div className="post-area-inner">
                        <div className="chat-modal">
                            <div className="modal-p-lang">
                                <h2 className="p-lang-span"></h2>
                            </div>
                            <div className='modal-article-area'>
                                <p className='modal-article-txt'></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hide-box' onClick={this.closeModal}></div>
            </div>
        )
    }
}

export default ViewChat