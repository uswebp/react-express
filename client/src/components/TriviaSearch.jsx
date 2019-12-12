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
            PAGE: 1,
            LIMIT: 20,
            COUNT: 0,
        };
    }
/*=======================================================================
 life cycle
=======================================================================*/
UNSAFE_componentWillMount() {
    // 初期設定
}

componentDidMount() {
    let page = this.state.PAGE;
    let limit = this.state.LIMIT;
    this.getTrivia(page, limit);
    this.getPcolor();
    this.getTriviaCount();
}
/*=======================================================================
methods
=======================================================================*/
    // 豆知識検索処理
    TriviaSearch = (e) => {
        console.log(e);
        e.preventDefault();  
        console.log("search");
    }
    // ページ遷移
    changePage = (val) => {
        let status = val.currentTarget.getAttribute('data-num');
        let page = this.state.PAGE;
        let limit = this.state.LIMIT;
        if (status === 'next') {
            page += 1;
        } else {
            if (page !== 1) {
                page -= 1
            }
        }
        this.getTrivia(page, limit);
        this.setPage(page);
        this.setLimit(limit);
        this.getTriviaCount();

        window.scrollTo(0, 0);
    }
    chengeCheck = () => {
        console.log("check!");
    }
    // 豆知識取得
    getTrivia = (page, limit) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/search_trivia/page/' + page + '/limit/' + limit)
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
    getTriviaCount = () => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/count_trivia')
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
        this.setState({ PAGE: data });
    }
    // 表示件数セット
    setLimit = (data) => {
        this.setState({ LIMIT: data });
    }
    // 豆知識件数セット
    setCount = (data) => {
        this.setState({ COUNT: data });
    }
    // 検索記事表示
    renderTrivia = () => ({ trivia_id, article, p_lang_color_code, p_lang_name, ins_dt }) => 
        <article className={`trivia-area`} key={trivia_id} >
            <div>{p_lang_name}</div>
            <div>{article}</div>
            <div>{ins_dt}</div>
        </article>

    renderPcolor = () => ({p_lang_id, p_lang_color_code, p_lang_name }) => 
        <div className={`p-lang-area`} key={p_lang_id} >
            <div>{p_lang_name} <input type="checkbox" checked onChange={() => this.chengeCheck()}/></div>
        </div>

selectPcolor = () => ({p_lang_id, p_lang_color_code, p_lang_name }) => <option value={p_lang_id}>{p_lang_name}</option>

    render() {
        const {TRIVIA} = this.state;
        const {P_LANG_COLOR} = this.state;
        let page = this.state.PAGE;
        let limit = this.state.LIMIT;
        let start = ((page * limit) - limit) + 1;
        let end = page * limit;
        let count = this.state.COUNT;
        let maxpage = Math.ceil(count / limit);

        return (
            <div>
                <form onSubmit={this.TriviaSearch} name="trivia_search" method="post" className="trivia-search">
                        <div className="input-search-txt">
                            <select name="p_lang_select">
                                <option value="all">全て</option>
                                {P_LANG_COLOR.map(this.selectPcolor())}
                            </select>
                            <input type="search" name="t_search" className="t-search" placeholder="Search" />
                            <div className="search-btn" id="search-btn"></div>
                        </div>
                </form>
                <div className="trivia-view">
                    <div>HIT:{count}</div>
                    <div>{start}件 ～ {end}件</div>
                    <div>{maxpage}ページ中{page}ページ</div>
                    <div className="p-lang-check">
                        {P_LANG_COLOR.map(this.renderPcolor())}
                    </div>
                    <div className="p-lang-box">
                        {TRIVIA.map(this.renderTrivia())}
                        <div className="page_n">
                            <span　onClick={this.changePage} data-num='back'>前のページ</span>
                            <span　onClick={this.changePage} data-num='next'>次のページ</span>
                        </div>
                    </div>
                    </div>
                </div>
        );
    }
};

export default TriviaSearch;