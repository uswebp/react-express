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
            SEARCH_WORD: "",
            SEARCH_P_LANG: 'all',
            HIT_COUNT: 0,
            serverURL: df.FULL_LOCAL_URL + ':' + df.SERVER_PORT,
            socket: socketIOClient(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT),
        };
    }
/*=======================================================================
 life cycle
=======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
        this.socketDct();
    }

    componentDidMount() {
        // 検索言語・検索ワード・表示件数・ページ数取得
        let c_p_lang = this.state.CURRENT_P_LANG;
        let c_word = this.state.CURRENT_WORD;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_page = this.state.CURRENT_PAGE;

        // 検索ワードがない時
        if (!c_word) {
            c_word = ' ';
        }
        // 豆知識を検索して取得
        this.getSearchTrivia(c_word, c_p_lang, c_page, c_limit);
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
        // 検索言語・検索ワード・表示件数・ページ数取得
        let search_word = document.querySelector('.t-search').value;
        let search_p_lang = document.querySelector('.p-lang-select').value;
        let c_limit = this.state.CURRENT_LIMIT;
        // ページリセット
        let c_page = 1;

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
        // 表示件数セット
        this.setLimit(c_limit);
        // 検索プログラミング言語セット
        this.setSearchPlang(search_p_lang);
        // 検索ワードセット
        this.setSearchWord(search_word);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
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
        // 検索言語・検索ワード・表示件数・ページ数取得
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        // 変更時の値
        let c_limit = e.target.value;
        // ページリセット
        let c_page = 1;

        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }

        // 表示件数セット
        this.setLimit(c_limit);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
    }

    /**
     * @description 言語選択変更時
     * @param {Object} e | イベント
     * @returns ×
     */
    changeSelectValue = (e) => {
        // 検索言語・検索ワード・表示件数・ページ数取得
        let search_p_lang = e.target.value;
        let search_word = document.querySelector('.t-search').value;
        let c_limit = this.state.CURRENT_LIMIT;
        // ページリセット
        let c_page = 1;
        // セレクトエリアの文言
        let nav_p_lang = '全て';
        // プログラミング言語カラー初期化
        let nav_p_color = '#666';
        // セレクトエリアのラベル取得
        let select_nav_name = document.querySelector('.nav-search-label');
        // 検索ワードがない時
        if (!search_word) {
            search_word = ' ';
        }
        // プログラミング言語が全て以外の時
        if (search_p_lang !== 'all') {
            // プログラミング言語id調整
            let nav_p_lang_num = search_p_lang - 1;
            // プログラミング言語名取得
            nav_p_lang = this.state.P_LANG_COLOR[nav_p_lang_num].p_lang_name;
            // プログラミング言語カラー取得
            nav_p_color = '#' + this.state.P_LANG_COLOR[nav_p_lang_num].p_lang_color_code;
        }

        // セレクトエリアのラベルを変更
        select_nav_name.innerText = nav_p_lang;
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
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
     * @description ページ遷移時
     * @param {Object} val | data-num受け渡し用
     * @returns ×
     */
    changePage = (val) => {
        // ページ遷移状態を取得
        let status = val.currentTarget.getAttribute('data-num');
        // 検索言語・検索ワード・表示件数・ページ数取得
        let search_p_lang = this.state.SEARCH_P_LANG;
        let search_word = this.state.SEARCH_WORD;
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;

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
        // ページセット ⇒ 1ページ目からスタート
        this.setPage(c_page);
        // 表示件数セット
        this.setLimit(c_limit);
        // 豆知識を検索して取得
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
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
    getSearchTrivia = (search_word, p_lang_id, c_page, limit) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/search_trivia_where/word/' + search_word + '/id/' + p_lang_id + '/page/' + c_page + '/limit/' + limit)
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
     * @description 投稿日時情報変換
     * @param {String} ins_dt | 追加日
     * @returns {String}　ins_dt | 変換後の日時
     */
    dateCnv(ins_dt) {
        // T ⇒ |
        ins_dt = ins_dt.replace('T', ' | ');
        // 訳分らん文字を消す
        ins_dt = ins_dt.replace('.000Z', '');
        return ins_dt;
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
            <div className="t-article">{article}</div>
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
        if (maxpage >= 6) {
            // 表示ページ番号 (現ページから5ページ分)
            let view_count = c_page + 5;
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
                page_list_view = maxpage - 5;
            }
            // ページリストを配列にセット
            for (let i = page_list_view; i < view_count; i++) {
                if (c_page === i) {
                    // 1ページ目
                    page_list_arr[page_count] = <span data-num={i} className={`page_list page_${i} now_page`}>{i}</span>;
                } else {
                    // 1ページ目以降
                    page_list_arr[page_count] = <span　onClick={this.changePage} data-num={i} className={`page_list page_${i}`}>{i}</span>;
                }
                page_count++;
            }
            // 2ページ以降 [1] の右隣に [...] を表示
            if (c_page > 2 ) {
                page_list_arr['dott1'] = <span className={`page_list page_dott1`}>...</span>
            }
            // 現ページが最大ページまで5ページ以上空いている時、最大ページ数の左隣に [...] を表示
            if (c_page < maxpage - 5) {
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
                    page_list_arr[i] = <span data-num={i} className={`page_list page_${i} now_page`}>{i}</span>;
                } else {
                    // 1ページ目以降
                    page_list_arr[i] = <span　onClick={this.changePage} data-num={i} className={`page_list page_${i}`}>{i}</span>;
                }
            }
        }
        // 1ページ以降の時 [前へ] ボタン表示
        if (c_page > 1) {
            prev_page = <span　onClick={this.changePage} data-num='prev' className="page-flow prev-page">前へ</span>;
        }
        // 最大ページ以外の時 [次へ] ボタン表示
        if (c_page !== maxpage) {
            next_page = <span　onClick={this.changePage} data-num='next' className="page-flow next-page">次へ</span>;
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
            <div className="trivia-content">
                <form onSubmit={this.TriviaSearch} name="trivia_search" method="post" className="trivia-search">
                        <div className="input-search-area">
                            <div className="input-search-area-sub">
                                <div className="select-nav">
                                    <div className="nav-search-plang" data-value="search-alias=aps">
                                        <span className="nav-search-label">全て</span>
                                    </div>
                                        <select name="p_lang_select" className="p-lang-select" value={this.state.CURRENT_P_LANG} onChange={this.changeSelectValue}>
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
                            <select name="limit_select" className="limit-select" value={this.state.CURRENT_LIMIT} onChange={this.changeLimit}>
                                <option value="10">10件</option>
                                <option value="20">20件</option>
                                <option value="50">50件</option>
                                <option value="100">100件</option>
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
                                {page_list_arr[1]}
                                {page_list_arr[2]}
                                {page_list_arr[3]}
                                {page_list_arr[4]}
                                {page_list_arr[5]}
                                {page_list_arr[6]}
                                {page_list_arr[7]}
                                {page_list_arr['dott2']}
                                {page_list_arr['max']}
                                {next_page}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        );
    }
};

export default TriviaSearch;