/*=======================================================================
 import
=======================================================================*/
import React from 'react';
import df from '../config/define';
import socketIOClient from "socket.io-client";
/*=======================================================================
 class
=======================================================================*/
class TriviaSearch extends React.Component {
    /**
     * @description コンストラクター
     * @param {} props | ?
     * @returns ×
     */
    constructor(props) {
        super(props);
        this.state = {
            TRIVIA: [],
            P_LANG_COLOR: [],
            CURRENT_PAGE: 1,
            CURRENT_LIMIT: 20,
            CURRENT_WORD: "",
            CURRENT_P_LANG: 'all',
            CURRENT_ORDER: 'date_desc',
            SEARCH_WORD: "",
            SEARCH_P_LANG: 'all',
            HIT_COUNT: 0,
            serverURL: df.FULL_LOCAL_URL + ':' + df.SERVER_PORT,
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
            SEND_TRIVIA_TXT: "",
            SEND_PLANG: 1,
        };
    }
/*=======================================================================
 life cycle
=======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
        // ソケット切断
        this.socketDct();
    }

    componentDidMount() {
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let c_p_lang = this.state.CURRENT_P_LANG;
        let c_word = this.state.CURRENT_WORD;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_page = this.state.CURRENT_PAGE;
        let c_order = this.state.CURRENT_ORDER;

        // 検索ワードがない時
        if (!c_word) {
            c_word = ' ';
        }
        // 豆知識を検索して取得
        this.getSearchTrivia(c_word, c_p_lang, c_page, c_limit, c_order);
        // 検索条件の豆知識数取得
        this.getTriviaCount(c_word, c_p_lang);
        // プログラミング言語情報取得
        this.getPcolor();
    }
/*=======================================================================
methods
=======================================================================*/
    /**
     * @description ページ遷移時ソケット情報削除
     * @param ×
     * @returns ×
     */
    socketDct = () => {
        let socket = this.state.socket;
        socket.emit('amputation_socket');
    }

    /**
     * @description 豆知識検索処理
     * @param {Object} e | イベント
     * @returns ×
     */
    TriviaSearch = (e) => {
        // イベントキャンセル
        e.preventDefault();
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_word = document.querySelector('.t-search').value;
        let search_p_lang = document.querySelector('.p-lang-select').value;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_order = this.state.CURRENT_ORDER;
        // ページリセット
        let c_page = 1;

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // [/] をエスケープ
        search_word = encodeURIComponent(search_word);

        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
        // 表示件数セット
        this.setLimit(c_limit);
        // 検索プログラミング言語セット
        this.setSearchPlang(search_p_lang);
        // 検索ワードセット
        this.setSearchWord(search_word);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // 検索条件の豆知識数取得
        this.getTriviaCount(search_word, search_p_lang);
    }

    /**
     * @description 検索ワード変更時
     * @param {Object} e | イベント
     * @returns ×
     */
    changeSearchWord = (e) => {
        // テキストボックスの値をセット
        this.setState({CURRENT_WORD: e.target.value});
    }

    /**
     * @description 表示件数変更時
     * @param {Object} e | イベント
     * @returns ×
     */
    changeLimit = (e) => {
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        // 変更時の値
        let c_limit = e.target.value;
        // ページリセット
        let c_page = 1;
        let c_order = this.state.CURRENT_ORDER;
        // 表示件数のラベル取得
        let select_limit_name = document.querySelector('.nav-search-list-label');

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // ラベル名の変更 [○○件]
        select_limit_name.innerText = c_limit + '件';
        // [/] をエスケープ
        search_word = encodeURIComponent(search_word);
        // 表示件数セット
        this.setLimit(c_limit);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
    }

    /**
     * @description 言語選択変更時
     * @param {Object} e | イベント
     * @returns ×
     */
    changePLang = (e) => {
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_p_lang = e.target.value;
        let search_word = document.querySelector('.t-search').value;
        let c_limit = this.state.CURRENT_LIMIT;
        // ページリセット
        let c_page = 1;
        let c_order = this.state.CURRENT_ORDER;
        // セレクトエリアの文言
        let nav_p_lang = '全て';
        // プログラミング言語カラー初期化
        let nav_p_color = '#666';
        // 全件数表示エリアの色
        let hit_area_color = '#f38080';
        // セレクトエリアのラベル取得
        let select_nav_name = document.querySelector('.nav-search-label');
        // ヒットカウントの背景色
        let hit_area = document.querySelector('.hit-count');
        // 送信用プログラミング言語のラベル
        let send_plang_name = document.querySelector('.nav-send-label');

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // プログラミング言語選択が「全て」以外の時
        if (search_p_lang !== 'all') {
            // プログラミング言語id調整
            let nav_p_lang_num = search_p_lang - 1;
            // プログラミング言語名取得
            nav_p_lang = this.state.P_LANG_COLOR[nav_p_lang_num].p_lang_name;
            // プログラミング言語カラー取得
            nav_p_color = '#' + this.state.P_LANG_COLOR[nav_p_lang_num].p_lang_color_code;
            hit_area_color = '#' + this.state.P_LANG_COLOR[nav_p_lang_num].p_lang_color_code;
            // 検索された現在のプログラミング言語を送信用言語にセット
            this.setState({SEND_PLANG: search_p_lang});
            // ラベル名変更
            send_plang_name.innerText = nav_p_lang;
        } else {
            // 「全て」を選択時、「HTML」を送信用言語にセット
            this.setState({SEND_PLANG: 1});
        }
        // セレクトエリアのラベルを変更
        select_nav_name.innerText = nav_p_lang;
        // ヒット件数の背景色を変更
        hit_area.style.background = hit_area_color;
        // [/] をエスケープ
        search_word = encodeURIComponent(search_word);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // 検索条件の豆知識数取得
        this.getTriviaCount(search_word, search_p_lang);
        // 検索された現在のプログラミング言語セット
        this.setState({CURRENT_P_LANG: search_p_lang});
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
        // 検索プログラミング言語セット
        this.setSearchPlang(search_p_lang);
    }

    /**
     * @description 並び替え時
     * @param {Object} e | イベント
     * @returns ×
     */
    changeOrder = (e) => {
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        let c_limit = this.state.CURRENT_LIMIT;
        // ページリセット
        let c_page = 1;
        let c_order = e.target.value;
        // セレクトエリアのラベル取得
        let select_order_name = document.querySelector('.nav-search-order-label');
        let order_label = '';
        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // セレクトエリアのラベルを変更
        switch (c_order) {
            case 'date_asc':
                order_label = '古い順';
                break;
            case 'date_desc':
                order_label = '新しい順';
                break;
            default:
                break;
        }
        // 並び替えラベル変更
        select_order_name.innerText = order_label;
        // [/] をエスケープ
        search_word = encodeURIComponent(search_word);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // 並び値セット
        this.setOrder(c_order);
        // ページ番号セット
        this.setPage(c_page);

    }

    /**
     * @description ページ遷移時
     * @param {Object} val | data-num受け渡し用
     * @returns ×
     */
    changePage = (val) => {
        // ページ遷移状態を取得
        let status = val.currentTarget.getAttribute('data-num');
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_order = this.state.CURRENT_ORDER;

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }

        // ステータス判断
        if (status === 'next') {
            // 「次へ」
            c_page += 1;
        } else if(status === 'prev'){
            // 「前へ」
            c_page -= 1
        }

        // statusが数値の時 ※ページ番号クリック時
        if (isNaN(status) === false) {
            // クリックされたページ値を設定
            c_page = Number(status);
        }
        // [/] をエスケープ
        search_word = encodeURIComponent(search_word);
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
        // 表示件数セット
        this.setLimit(c_limit);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // 検索条件の豆知識数取得
        this.getTriviaCount(search_word, search_p_lang);

        // ページ上部へ戻る
        window.scrollTo(0, 0);
    }

    /**
     * @description プログラミング言語情報取得
     * @param ×
     * @returns ×
     */
    getPcolor = () => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/p_lang_color')
            .then(response => response.json())
            .then((data) => {
            // プログラミング言語情報セット
            this.setPcolor(data);
            })
            .catch(err => console.error(err))
    }

    /**
     * @description 豆知識検索結果取得
     * @param {String} search_word | 検索ワード
     * @param {Int} p_lang_id | 検索プログラミング言語
     * @param {Int} c_page | ページ数
     * @param {Int} limit | 表示件数
     * @returns ×
     */
    getSearchTrivia = (search_word, p_lang_id, c_page, limit, c_order) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/search_trivia_where/word/' + search_word + '/id/' + p_lang_id + '/page/' + c_page + '/limit/' + limit + '/order/' + c_order)
            .then(response => response.json())
            .then((data) => {
                // 豆知識情報セット
                this.setTrivia(data);
            })
            .catch(err => console.error(err))
    }

    /**
     * @description 検索豆知識数取得
     * @param {String} search_word | 検索ワード
     * @param {Int} p_lang_id | 検索プログラミング言語
     * @returns ×
     */
    getTriviaCount = (search_word, p_lang_id) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/count_trivia/word/' + search_word + '/id/' + p_lang_id)
            .then(response => response.json())
            .then((data) => {
            // 総件数セット
            this.setCount(data.count[0].cnt);
            })
            .catch(err => console.error(err))
    }

    /**
     * @description 豆知識投稿処理
     * @param {String} s_trivia_txt | 投稿内容
     * @param {Int} s_plang_id | 投稿プログラミング言語
     * @returns ×
     */
    insTrivia = (s_trivia_txt, s_plang_id) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/ind_trivia/article/' + s_trivia_txt + '/id/' + s_plang_id)
            .then(response => response.json())
            .then((data) => {
                // 登録判定
                if(data.res) {
                    // 投稿成功時
                    this.insCheck('ok');
                } else {
                    // 投稿失敗時
                    this.insCheck('ng');
                }
            })
            .catch(err => console.error(err))
    }

    /**
     * @description 豆知識投稿処理
     * @param {Object} e | イベント
     * @returns ×
     */
    sendTrivia = (e) => {
        // イベントキャンセル
        e.preventDefault();
        let s_trivia_txt = this.state.SEND_TRIVIA_TXT;
        let s_plang_id = this.state.SEND_PLANG;
        // 検索言語・検索ワード・表示件数・ページ数取得・並び替え
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_order = this.state.CURRENT_ORDER;
        // テキストボックスエリア
        let send_txt_area = document.querySelector('.trivia-txt-area textarea');
        // 投稿ボタン
        let post_btn = document.getElementById('t-post-btn');
        // 投稿文字数エリア
        let input_text_num = document.querySelector('.input-text-num');

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // [/] をエスケープ
        s_trivia_txt = encodeURIComponent(s_trivia_txt);
        // 投稿!
        this.insTrivia(s_trivia_txt, s_plang_id);
        // 豆知識を再検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit, c_order);
        // 豆知識数再取得
        this.getTriviaCount(search_word, search_p_lang);
        // テキストエリア初期化
        send_txt_area.innerText = '';
        this.setSendTriviaTxt('');
        // 投稿ボタンスタイルリセット
        post_btn.classList.add('btn-disable');
        post_btn.classList.remove('btn-02');
        // 文字数リセット
        input_text_num.innerText = '0';
    }

    /**
     * @description 豆知識セット
     * @param {Object} data | 豆知識情報
     * @returns ×
     */
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.trivia });
    }

    /**
     * @description 豆知識件数セット
     * @param {Int} data | 豆知識件数情報
     * @returns ×
     */
    setCount = (data) => {
        this.setState({ HIT_COUNT: data });
    }

    /**
     * @description プログラム言語情報セット
     * @param {Object} data | プログラム言語情報
     * @returns ×
     */
    setPcolor = (data) => {
        this.setState({ P_LANG_COLOR: data.color });
    }

    /**
     * @description ページセット
     * @param {Int} data | ページ情報
     * @returns ×
     */
    setPage = (data) => {
        this.setState({ CURRENT_PAGE: data });
    }

    /**
     * @description 表示件数セット
     * @param {Int} data | 表示件数情報
     * @returns ×
     */
    setLimit = (data) => {
        this.setState({ CURRENT_LIMIT: data });
    }

    /**
     * @description 検索プログラミング言語
     * @param {Int} data | 検索プログラミング言語ID
     * @returns ×
     */
    setSearchPlang = (data) => {
        this.setState({ SEARCH_P_LANG: data });
        this.setState({ SEND_PLANG: data });
    }

    /**
     * @description 検索ワード
     * @param {String} data | 検索ワード
     * @returns ×
     */
    setSearchWord = (data) => {
        this.setState({ SEARCH_WORD: data });
    }

    /**
     * @description 投稿内容
     * @param {String} data | 投稿文字
     * @returns ×
     */
    setSendTriviaTxt = (data) => {
        this.setState({ SEND_TRIVIA_TXT: data });
    }

    /**
     * @description 並び替え
     * @param {String} data | 並び替え条件
     * @returns ×
     */
    setOrder = (data) => {
        this.setState({ CURRENT_ORDER: data });
    }

    /**
     * @description 投稿プログラミング言語をセット
     * @param {Object} e | イベント
     * @returns ×
     */
    changeSendPLang = (e) => {
        // プログラミング言語ラベル取得
        let send_plang_name = document.querySelector('.nav-send-label');
        // プログラミング言語値取得
        let nav_p_lang_num = e.target.value;
        // プログラミング言語情報取得
        let nav_p_lang = this.state.P_LANG_COLOR[nav_p_lang_num - 1].p_lang_name;
        // プログラミング言語名取得
        send_plang_name.innerText = nav_p_lang;
        // 送信用プログラミング言語をセット
        this.setState({ SEND_PLANG: nav_p_lang_num });
    }

    /**
     * @description 投稿文字変更時
     * @param {Object} e | イベント
     * @returns ×
     */
    changeSendWord = (e) => {
        // 投稿文字数エリア
        let input_text_num = document.querySelector('.input-text-num');
        // 投稿ボタン
        let post_btn = document.getElementById('t-post-btn');
        // 投稿文字取得
        let send_txt = e.target.value;
        // 投稿文字数
        let send_txt_num = send_txt.length;
        // 投稿文字数を表示
        input_text_num.innerText = send_txt_num;
        // 文字数判定
        if (send_txt_num > 0) {
            post_btn.classList.add('btn-02');
            post_btn.classList.remove('btn-disable');
        } else {
            post_btn.classList.add('btn-disable');
            post_btn.classList.remove('btn-02');
        }
        if (send_txt_num > df.MAX_SEND_TXT_LENGTH) {
            // 最大文字数超えた時
            input_text_num.style.color = "#e63b3b";
            input_text_num.style.fontWeight = "bold";
        } else {
            // 文字数超えていない時
            input_text_num.style.color = "#999";
            input_text_num.style.fontWeight = "normal";
            // 日本語入力の際、最大投稿文字を超えないよう超えた文字を削除する
            send_txt.slice(0, df.MAX_SEND_TXT_LENGTH);
        }
        // 送信用テキストをセット
        this.setState({ SEND_TRIVIA_TXT: send_txt });
    }

    /**
     * @description 投稿日時情報変換
     * @param {String} ins_dt | 追加日
     * @returns {String}　ins_dt | 変換後の日時
     */
    dateCnv(ins_dt) {
        // 今日
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        // 返り値
        let res_ins_dt = '';

        // 登録日・日付整形 [yyyy/mm/dd hh:ii:ss]
        let ins_dt_shap = ins_dt.replace(/-/g, '/');
        // 登録日・日付整形 [yyyy/mm/dd]
        let ins_day = ins_dt_shap.replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, '');
        // 今日・日付整形 [yyyy/mm/dd hh:ii:ss]
        let sum_today =  year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
        // 今日・日付整形 [yyyy/mm/dd]
        let today = year + '/' + month + '/' + day;

        // 日付 ⇒ 経過秒数
        // let before_day = new Date(ins_day);
        // let f_today = new Date(today);
        let ins_dt_shap_conv = new Date(ins_dt_shap);
        let sum_today_conv = new Date(sum_today);

        // 秒数差 ⇒ 日数差
        // let term_day = Math.floor((f_today - before_day) / (1000 * 60 * 60 * 24));
        let sum_term_day = Math.floor((sum_today_conv - ins_dt_shap_conv) / (1000 * 60 * 60 * 24));
        // 秒数差 ⇒ 時間差
        let sum_term_hour = Math.floor((sum_today_conv - ins_dt_shap_conv) / (1000 * 60 * 60));
        // 秒数差 ⇒ 分数差
        let sum_term_min = Math.floor((sum_today_conv - ins_dt_shap_conv) / (1000 * 60));
        // 秒差取得 ⇒ 秒数差
        let sum_term_sec = Math.floor((sum_today_conv - ins_dt_shap_conv) / (1000));
        // 投稿日から1週間以内の場合
        if (sum_term_day <= 7) {
            // 投稿から1秒以内
            if (sum_term_min === 0) {
                res_ins_dt = sum_term_sec + ' secound ago';
            } else if (sum_term_hour === 0) {
                // 投稿から1時間以内
                res_ins_dt = sum_term_min + ' minute ago';
            } else if (sum_term_day === 0) {
                // 投稿から1日以内
                res_ins_dt = sum_term_hour + ' hour ago';
            } else {
                // 投稿から7日以内
                res_ins_dt = sum_term_day + ' day ago';
            }
        } else {
            // 投稿から一週間以上の場合 [yyyy/mm/dd]
            res_ins_dt = ins_day;
        }
        return res_ins_dt;
    }

    /**
     * @description 投稿エリア非表示
     * @param ×
     * @returns ×
     */
    closeModal = () => {
        let modal_hide = document.querySelector('.hide-box');
        let post_area = document.querySelector('.post-area');
        let ins_check_area = document.querySelector('.ins-check-area');
        // 投稿ボタン
        let post_btn = document.getElementById('t-post-btn');

        // 送信エリア非表示
        modal_hide.style.display = 'none';
        post_area.style.display = 'none';
        // 完了メッセージ削除
        while (ins_check_area.firstChild) {
            ins_check_area.removeChild(ins_check_area.firstChild);
        }
        if (post_btn.classList.contains('btn-02') && !(post_btn.classList.contains('btn-disable'))) {
            // 投稿ボタンスタイルリセット
            post_btn.classList.add('btn-disable');
            post_btn.classList.remove('btn-02');
        }
    }

    /**
     * @description 投稿エリア表示
     * @param ×
     * @returns ×
     */
    opneModal = () => {
        let modal_hide = document.querySelector('.hide-box');
        let post_area = document.querySelector('.post-area');
        let send_txt_area = document.querySelector('.trivia-txt-area textarea');
        let input_text_num = document.querySelector('.input-text-num');
        // 送信エリア表示
        modal_hide.style.display = 'block';
        post_area.style.display = 'block';
        // 投稿文字数初期化
        input_text_num.innerText = 0;
        // 送信テキストエリア初期化
        send_txt_area.innerText = '';
        this.setSendTriviaTxt('');
    }

    /**
     * @description 投稿チェック
     * @param chk | [ok | ng]
     * @returns ×
     */
    insCheck = (chk) => {
        let ins_check_area = document.querySelector('.ins-check-area');
        let div = document.createElement('div');
        let span = document.createElement('span');
        let ins_check_msg = '';
        let font_color = '';
        // 投稿完了メッセージが残っていれば削除
        while (ins_check_area.firstChild) {
            ins_check_area.removeChild(ins_check_area.firstChild);
        }
        // 投稿判定
        if (chk === 'ok') {
            // 投稿成功時
            ins_check_msg = '投稿が完了しました';
            font_color = '#10b905';
        } else {
            // 投稿失敗時
            ins_check_msg = '投稿が失敗しました';
            font_color = '#e63b3b';
        }
        // クラス追加
        div.classList.add('ins-move');
        // 要素追加
        ins_check_area.appendChild(div).appendChild(span).innerText = ins_check_msg;
        // 完了メッセージ取得
        let ins_move = ins_check_area.querySelector('.ins-move');
        ins_move.style.color = font_color;
        // 完了メッセージ表示後
        ins_check_area.addEventListener('animationend',function(){
            // 完了メッセージ削除
            while (ins_check_area.firstChild) {
                ins_check_area.removeChild(ins_check_area.firstChild);
            }
        });
    }

    /**
     * @description 豆知識情報生成
     * @param {Int} trivia_id | 豆知識番号
     * @param {String} article | 投稿内容
     * @param {String} p_lang_color_code | プログラム言語カラー
     * @param {String} p_lang_name | プログラム言語名
     * @param {String} ins_t | 投稿日時
     * @returns ×
     */
    renderTrivia = () => ({ trivia_id, article, p_lang_color_code, p_lang_name, ins_t }) =>
        <article className={`trivia-area`} key={trivia_id} >
            <div className="p-lang-name" style={{ borderColor: '#' + p_lang_color_code }}>{p_lang_name}</div>
            <div className="t-article" style={{whiteSpace: 'pre-line'}}>{article}</div>
            <div className="t-ins-dt">{this.dateCnv(ins_t)}</div>
        </article>

    /**
     * @description セレクトメニュー生成
     * @param {Int} p_lang_id | 豆知識番号
     * @param {String} p_lang_name | プログラム言語名
     * @returns ×
     */
    selectPcolor = () => ({p_lang_id, p_lang_name }) => <option value={p_lang_id} key={p_lang_id}>{p_lang_name}</option>

    render() {
        //===================================================
        // state情報取得
        //===================================================
        // 豆知識
        const {TRIVIA} = this.state;
        // プログラム言語
        const {P_LANG_COLOR} = this.state;
        // ページ番号
        let c_page = this.state.CURRENT_PAGE;
        // 表示件数
        let c_limit = this.state.CURRENT_LIMIT;
        // 検索ヒット数
        let count = this.state.HIT_COUNT;
        //===================================================
        // 最大ページ数
        let maxpage = Math.ceil(count / c_limit);
        // 取得スタート件数 (○件~)
        let start = ((c_page * c_limit) - c_limit) + 1;
        // 取得最終件数 (~○件)
        let end = c_page * c_limit;
        // 次へボタン初期化
        let next_page = "";
        // 前へボタン初期化
        let prev_page = "";
        //===================================================
        // ページ設定
        //===================================================
        // ページリスト配列初期化
        let page_list_arr = [];

        // 最大ページ数が6以上の時
        if (maxpage > df.VIEW_PAGE_NUMBER + 1) {
            // 表示ページ番号 (現ページから5ページ分)
            let view_count = c_page + df.VIEW_PAGE_NUMBER;
            // 配列用カウント番号
            let page_count = 1;
            // ページリストのループ開始番号初期化
            let page_list_view = c_page ;
            // 1ページ目の時以外
            if (c_page !== 1) {
                // [1]を表示
                page_list_arr['first'] = <span onClick={this.changePage} data-num='1' className={`page_list page_1`}>1</span>;
            }
            // 表示ページ番号が最大ページ数より大きい時
            if (view_count >= maxpage) {
                // ループの回数を最大ページ数までに
                view_count = maxpage;
                // ループの開始位置を最大ページ数から逆算
                page_list_view = maxpage - df.VIEW_PAGE_NUMBER;
            }
            // ページリストを配列にセット
            for (let i = page_list_view; i < view_count; i++) {
                if (c_page === i) {
                    // 1ページ目
                    page_list_arr[page_count] = <span data-num={i} className={`page_list page_${i} now_page`} key={i}>{i}</span>;
                } else {
                    // 1ページ目以降
                    page_list_arr[page_count] = <span　onClick={this.changePage} data-num={i} className={`page_list page_${i}`} key={i}>{i}</span>;
                }
                page_count++;
            }
            // 2ページ以降 [1] の右隣に [...] を表示
            if (c_page > 2 ) {
                page_list_arr['dott1'] = <span className={`page_list page_dott1`}>...</span>
            }
            // 現ページが最大ページまで5ページ以上空いている時、最大ページ数の左隣に [...] を表示
            if (c_page < maxpage - df.VIEW_PAGE_NUMBER) {
                page_list_arr['dott2'] = <span className={`page_list page_dott2`}>...</span>
            }
            // 最大ページ数
            if (c_page === maxpage) {
                page_list_arr['max'] = <span data-num={maxpage} className={`page_list page_${maxpage} now_page`}>{maxpage}</span>
            } else {
                page_list_arr['max'] = <span　onClick={this.changePage} data-num={maxpage} className={`page_list page_${maxpage}`}>{maxpage}</span>
            }
        } else {
            // 最大ページ数が5以下の時
            for (let i = 1; i <= maxpage; i++) {
                if (c_page === i) {
                    // 1ページ目
                    page_list_arr[i] = <span data-num={i} className={`page_list page_${i} now_page`} key={i}>{i}</span>;
                } else {
                    // 1ページ目以降
                    page_list_arr[i] = <span　onClick={this.changePage} data-num={i} className={`page_list page_${i}`} key={i}>{i}</span>;
                }
            }
        }
        // 1ページ以降の時 [前へ] ボタン表示
        if (c_page > 1) {
            prev_page = <span　onClick={this.changePage} data-num='prev' className="page-flow prev-page">
                            <i className="material-icons r_arrow">
                                keyboard_arrow_left
                            </i>
                        </span>;
        }
        // 最大ページ以外の時 [次へ] ボタン表示
        if (c_page !== maxpage) {
            next_page = <span　onClick={this.changePage} data-num='next' className="page-flow next-page">
                <i className="material-icons r_arrow">
                    keyboard_arrow_right
                </i>
            </span>;
        } else {
            // 現ページが最大ページの時最終件数を総数に変更
            end = count;
        }
        // 取得豆知識が無いとき
        if (count === 0) {
            next_page = "";
            c_page = 0;
            start = 0;
            end = 0;
        }
        //===================================================

        return (
            <div className="trivia-content" lang='en'>
                <form onSubmit={this.TriviaSearch} name="trivia_search" method="post" className="trivia-search">
                        <div className="input-search-area">
                            <div className="input-search-area-sub">
                                <div className="select-nav">
                                    <div className="nav-search-plang" data-value="search-alias=aps">
                                        <span className="nav-search-label">全て</span>
                                    </div>
                                        <select name="p_lang_select" className="p-lang-select" value={this.state.CURRENT_P_LANG} onChange={this.changePLang}>
                                            <option value="all">全て</option>
                                            {P_LANG_COLOR.map(this.selectPcolor())}
                                        </select>
                                </div>
                                <div className="search-t-txt">
                                    <input type="search" name="t_search" className="t-search" placeholder="Search" value={this.state.CURRENT_WORD} onChange={this.changeSearchWord} />
                                    <div className="search-btn" id="search-btn" onClick={this.TriviaSearch}>
                                        <div className="search-icon">
                                            <i className="material-icons search-i">
                                                search
                                            </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </form>
                <div className="trivia-view">
                    <div className="search-result">
                        <div className="limit-select-box">
                        <div className="nav-search-list" data-value="search-alias=aps">
                                    <span className="nav-search-list-label">20件</span>
                            </div>
                            <select name="limit_select" className="limit-select" value={this.state.CURRENT_LIMIT} onChange={this.changeLimit}>
                                <option value="10">10件</option>
                                <option value="20">20件</option>
                                <option value="50">50件</option>
                                <option value="100">100件</option>
                            </select>
                        </div>
                        <div className="order-select-box">
                        <div className="nav-search-order" data-value="search-alias=aps">
                                    <span className="nav-search-order-label">新しい順</span>
                            </div>
                            <select name="order_select" className="order-select" value={this.state.CURRENT_ORDER} onChange={this.changeOrder}>
                                {/* <option value="default">並び替え</option> */}
                                <option value="date_asc">古い順</option>
                                <option value="date_desc">新しい順</option>
                                {/* <option value="order_fav">お気に入り数</option> */}
                            </select>
                        </div>

                        <div className="hit-count">全 {count} 件</div>
                        <div className="start-end-count"> {maxpage}ページ中{c_page}ページ / {start}件 ～ {end}件 </div>
                    </div>

                    <div className="p-lang-box">
                        {TRIVIA.map(this.renderTrivia())}
                        <div className="page_n">
                            <div className="page_n_inner">
                                {prev_page}
                                {page_list_arr['first']}
                                {page_list_arr['dott1']}
                                {page_list_arr}
                                {page_list_arr['dott2']}
                                {page_list_arr['max']}
                                {next_page}
                            </div>
                        </div>
                    </div>
                    <div className="send-trivia-area">
                        <div className="send-trivia-icon">
                            <i className="material-icons send-icon" onClick={this.opneModal}>
                                post_add
                            </i>
                        </div>
                    </div>
                    </div>
                    <div className="post-area">
                        <div className="post-area-inner">
                            <form name="trivia-send-form" className="trivia-send-form" onSubmit={this.sendTrivia}>
                                <div className="trivia-send-form-inner">
                                        <div className="send-plang-area">
                                            <div className="send-plang-box">
                                                <div className="nav-send-plang" data-value="search-alias=aps">
                                                    <span className="nav-send-label">HTML</span>
                                                </div>
                                                <select name="send-plang" className="send-plang" value={this.state.SEND_PLANG} onChange={this.changeSendPLang}>
                                                    {P_LANG_COLOR.map(this.selectPcolor())}
                                                </select>
                                            </div>
                                        </div>
                                    <div className="trivia-txt-area">
                                        <textarea maxLength={df.MAX_SEND_TXT_LENGTH} required placeholder="プログラミングに関する豆知識を入力してください" value={this.state.SEND_TRIVIA_TXT} onChange={this.changeSendWord}></textarea>
                                    </div>
                                    <div className="send-area-foot">
                                        <div className="send_btn">
                                            <input type="submit" value="投稿↪" id="t-post-btn" className="btn-basic btn-disable" />
                                        </div>
                                        <div className="txt-count-area">
                                            <span className="txt-counter"><span className="input-text-num">0</span>文字 / 150文字</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='ins-check-area'>
                                </div>
                                <div className='close-mdl-area'>
                                    <span className="close-mdl" onClick={this.closeModal}>閉じる</span>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='hide-box' onClick={this.closeModal}></div>
                </div>
        );
    }
};

export default TriviaSearch;