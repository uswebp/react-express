/*=======================================================================
 import
=======================================================================*/
import React from 'react';
import df from '../config/define';
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
        };
    }
/*=======================================================================
 life cycle
=======================================================================*/
    UNSAFE_componentWillMount() {
        // 初期設定
    }

    componentDidMount() {
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_word = this.state.CURRENT_WORD;
        let c_p_lang = this.state.CURRENT_P_LANG;

        if (!c_word) {
            c_word = ' ';
        }
        
        this.getSearchTrivia(c_word, c_p_lang, c_page, c_limit);
        this.getTriviaCount(c_word, c_p_lang);
        this.getPcolor();
    }
/*=======================================================================
methods
=======================================================================*/
    // 豆知識検索処理
    TriviaSearch = (e) => {
        e.preventDefault();  
        let search_word = document.querySelector('.t-search').value;
        let search_p_lang = document.querySelector('.p-lang-select').value;
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;

        if (!search_word) {
            search_word = ' ';
        }
    
        this.setPage(1);
        this.setLimit(c_limit);
        this.setSearchPlang(search_p_lang);
        this.setSearchWord(search_word);
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
        this.getTriviaCount(search_word, search_p_lang);
    }
    // 検索ワード変更時
    changeSearch = (e) => {
        this.setState({CURRENT_WORD: e.target.value});
    }
    // 表示件数変更時
    changeLimit = (e) => {
        let search_word = this.state.SEARCH_WORD;
        let search_p_lang = this.state.SEARCH_P_LANG;
        let c_limit = e.target.value;
        let c_page = this.state.CURRENT_PAGE;
        if (!search_word) {
            search_word = ' ';
        }

        this.setState({CURRENT_LIMIT: c_limit});
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);

    }
    // 言語選択変更時
    changeSelectValue = (e) => {
        let search_word = this.state.SEARCH_WORD;
        let search_p_lang = e.target.value;
        let c_limit = this.state.CURRENT_LIMIT;
        let c_page = this.state.CURRENT_PAGE;
        if (!search_word) {
            search_word = ' ';
        }
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
        this.getTriviaCount(search_word, search_p_lang);
        this.setState({CURRENT_P_LANG: search_p_lang});
    }

    // ページ遷移
    changePage = (val) => {
        let status = val.currentTarget.getAttribute('data-num');
        let pflg = val.currentTarget.getAttribute('data-pflg');
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;
        let search_word = this.state.SEARCH_WORD;
        let search_p_lang = this.state.SEARCH_P_LANG;

        if (status === 'next') {
            c_page += 1;
        } else {
            if (c_page !== 1) {
                c_page -= 1
            } 
        }
        if (!search_word) {
            search_word = ' ';
        }
        
        this.setPage(c_page);
        this.setLimit(c_limit);
        this.getSearchTrivia(search_word, search_p_lang, c_page, c_limit);
        this.getTriviaCount(search_word, search_p_lang);

        window.scrollTo(0, 0);
    }

    // 豆知識検索結果取得
    getSearchTrivia = (search_word, p_lang_id, c_page, limit) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/search_trivia_where/word/' + search_word + '/id/' + p_lang_id + '/page/' + c_page + '/limit/' + limit)
            .then(response => response.json())
            .then((data) => {
                this.setTrivia(data);
            })
            .catch(err => console.error(err))
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
    // 豆知識数取得
    getTriviaCount = (search_word, search_pg) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/count_trivia/word/' + search_word + '/id/' + search_pg)
            .then(response => response.json())
            .then((data) => {
            this.setCount(data.count[0].cnt);
            })
            .catch(err => console.error(err))
    }
    
    // 豆知識セット
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.trivia });
    }
    // 言語カラーセット
    setPcolor = (data) => {
        this.setState({ P_LANG_COLOR: data.color });
    }
    // ページセット
    setPage = (data) => {
        this.setState({ CURRENT_PAGE: data });
    }
    // 表示件数セット
    setLimit = (data) => {
        this.setState({ CURRENT_LIMIT: data });
    }
    // 豆知識件数セット
    setCount = (data) => {
        this.setState({ HIT_COUNT: data });
    }
    // 検索プログラミング言語
    setSearchPlang = (data) => {
        this.setState({ SEARCH_P_LANG: data });
    }
    // 検索ワード
    setSearchWord = (data) => {
        this.setState({ SEARCH_WORD: data });
    }

    // 検索記事表示
    renderTrivia = () => ({ trivia_id, article, p_lang_color_code, p_lang_name, ins_t }) => 
        <article className={`trivia-area`} key={trivia_id} >
            <div>{p_lang_name}</div>
            <div>{article}</div>
            <div>{ins_t}</div>
        </article>

    selectPcolor = () => ({p_lang_id, p_lang_color_code, p_lang_name }) => <option value={p_lang_id} key={p_lang_id}>{p_lang_name}</option>

    render() {
        console.log(this.state);
        const {TRIVIA} = this.state;
        const {P_LANG_COLOR} = this.state;
        let c_page = this.state.CURRENT_PAGE;
        let c_limit = this.state.CURRENT_LIMIT;
        let count = this.state.HIT_COUNT;
        let maxpage = Math.ceil(count / c_limit);
        let start = ((c_page * c_limit) - c_limit) + 1;
        let end = c_page * c_limit;
        let next_page = "";
        let prev_page = "";
        if (c_page > 1) {
            prev_page = <span　onClick={this.changePage} data-num='prev' >前のページ</span>;
        }
        if (c_page !== maxpage) {
            next_page = <span　onClick={this.changePage} data-num='next' >次のページ</span>;
        } else {
            end = count;
        }

        return (
            <div>
                <form onSubmit={this.TriviaSearch} name="trivia_search" method="post" className="trivia-search">
                        <div className="input-search-txt">
                            <select name="p_lang_select" className="p-lang-select" value={this.state.CURRENT_P_LANG} onChange={this.changeSelectValue}>
                                <option value="all">全て</option>
                                {P_LANG_COLOR.map(this.selectPcolor())}
                            </select>
                            <input type="search" name="t_search" className="t-search" placeholder="Search" value={this.state.CURRENT_WORD} onChange={this.changeSearch} />
                            <div className="search-btn" id="search-btn"></div>
                        </div>
                </form>
                <div className="trivia-view">
                    <select name="limit_select" className="limit-select" value={this.state.CURRENT_LIMIT} onChange={this.changeLimit}>
                        <option value="10">10件</option>
                        <option value="20">20件</option>
                        <option value="50">50件</option>
                        <option value="100">100件</option>
                    </select>

                    <div>HIT:{count}</div>
                    <div>{start}件 ～ {end}件</div>
                    <div>{maxpage}ページ中{c_page}ページ</div>
                    <div className="p-lang-box">
                        {TRIVIA.map(this.renderTrivia())}
                        <div className="page_n">
                            {prev_page}
                            {next_page}
                        </div>
                    </div>
                    </div>
                </div>
        );
    }
};

export default TriviaSearch;