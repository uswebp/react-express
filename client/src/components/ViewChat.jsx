/*=======================================================================
 import
=======================================================================*/
import React, { Component } from "react";
import EventListener from 'react-event-listener';
import df from '../config/define';
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
            TABLE_SIZE_WIDTH: 0,
            TABLE_SIZE_HEIGHT: 0,
            TAG_NUM: 0,
            TAG_SIZE: 0,
            TR_NUM: 0,
            TD_NUM: 0,
            TOTAL_TD: 0,
            TAG_RANDUM_ARR: [],
            TRIVIA: [],
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
        const TOTAL_TD = this.state.TOTAL_TD;
        // Fetch・DOM操作
        this.installationGetTag(TOTAL_TD);
    }
/*=======================================================================
 methods
=======================================================================*/
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
        let td_num = 0;
        let tr_num = 0;
        // td数
        if (table_size_width < 450) {
            td_num = 3;
        } else if(table_size_width >= 450 && table_size_width < 600) {
            td_num = 3;
        } else if(table_size_width >= 600 && table_size_width < 700){
            td_num = 4;
        } else if(table_size_width >= 600 && table_size_width < 700){
            td_num = 5;
        } else if(table_size_width >= 700 && table_size_width < 800){
            td_num = 5;
        } else if(table_size_width >= 800 && table_size_width < 900){
            td_num = 6;
        } else if(table_size_width >= 900 && table_size_width < 1000){
            td_num = 7;
        } else if(table_size_width >= 1000 && table_size_width < 1200){
            td_num = 8;
        } else if(table_size_width >= 1200 && table_size_width < 1400){
            td_num = 9;
        } else if(table_size_width >= 1400){
            td_num = 10;
        }
        // tr数
        if(table_size_height < 450) {
            tr_num = 3;
        } else if(table_size_height >= 450 && table_size_height < 600) {
            tr_num = 4;
        } else if(table_size_height >= 600 && table_size_height < 700){
            tr_num = 5;
        } else if(table_size_height >= 700 && table_size_height < 800){
            tr_num = 5;
        } else if(table_size_height >= 800 && table_size_height < 900){
            tr_num = 5;
        } else if(table_size_height >= 900 && table_size_height < 1000){
            tr_num = 6;
        } else if(table_size_height >= 1000 && table_size_height < 1100){
            tr_num = 7;
        } else if(table_size_height >= 1100){
            tr_num = 7;
        }
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
        // stateに値をセット
        this.setState({ TD_NUM: td_num });
        this.setState({ TR_NUM: tr_num });
        this.setState({ TOTAL_TD: total_td });
        this.setState({ TAG_SIZE: tag_size });
        this.setState({ TAG_NUM: tag_num });
        this.setState({ TABLE_SIZE_WIDTH: table_size_width });
        this.setState({ TABLE_SIZE_HEIGHT: table_size_height });
        // 初回のDOM操作を回避
        if(this.state.TAG_RANDUM_ARR.length !== 0){
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
            // 豆知識取得
            this.getTrivia(data.randum, trivia_num);
          })
          .catch(err => console.error(err))
    }
    /**
     * @description 豆知識取得
     * @param {Array} randum // 乱数配列
     * @param {Int} trivia_num // 取得する豆知識の個数
     * @returns ×
     */
    getTrivia = (randum, trivia_num) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/trivia/'+ trivia_num)
          .then(response => response.json())
          .then((data) => {
            let tag_size = this.state.TAG_SIZE;
            let tag_num = this.state.TAG_NUM;
            // タグを生成
            this.tagGeneration(tag_size, randum, tag_num, data.trivia);
            // 乱数配列をセット
            this.setTagNum(randum);
            this.setTrivia(data);
        }).catch(err => console.error(err))
    }
    /**
     * @description タグの乱数をstateにセット
     * @param {Array} data | 乱数配列
     * @returns ×
     */
    setTagNum = (data) => {
        this.setState({ TAG_RANDUM_ARR: data });
    }
    /**
     * @description 豆知識をstateにセット
     * @param {Object} data | 豆知識
     * @returns ×
     */
    setTrivia = (data) => {
        this.setState({ TRIVIA: data.trivia });
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
     * @param {Int} size | タグサイズ
     * @param {Array} randum_array | 乱数配列
     * @param {Int} tag_num | 出力タグ数
     * @param {Object} trivia | 豆知識
     * @returns ×
     */
    tagGeneration = (size, randum_array, tag_num, trivia) => {
        // 乱数配列が存在する場合
        if(randum_array){
            // td取得
            let triviaTd = document.querySelectorAll('.trvia-td');
            // 全てのタグをリセット
            for (let i = 0; i < triviaTd.length; i++) {
                while (triviaTd[i].firstChild) {
                    triviaTd[i].removeChild(triviaTd[i].firstChild);
                }
            }
            // タグをランダムに設置
            for (let i = 0; i < triviaTd.length; i++) {
                // タグの個数分ループ
                if (i === tag_num) {
                    break;
                }
                // 豆知識情報セット
                let p_lang_name = trivia[i].p_lang_name;
                let trivia_id = trivia[i].trivia_id;
                let p_lang_color_code = trivia[i].p_lang_color_code;
                // 乱数取り出し
                let tn = randum_array[i];
                // タグを生成後、配置
                let div = document.createElement('div');
                let span = document.createElement('span');
                div.classList.add('trivia-tag');
                div.classList.add('tag-id-' + trivia_id);
                span.classList.add('trivia-name');
                // プログラミング言語セット
                triviaTd[tn].appendChild(div).appendChild(span).innerText = p_lang_name;
                // プログラミング言語カラーセット
                triviaTd[tn].querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;
            }
            // 生成した後タグを取得
            let triviaTag = document.querySelectorAll('.trivia-tag');
            // タグにスタイル適応
            this.tagStyleAddition(triviaTag, size);
        }
    }
    /**
     * @description タグのスタイル適応処理(CSSアニメーション振り分け含む)
     * @param {Object} tag | 生成された豆知識タグ要素
     * @param {Int} size | タグの大きさ
     * @returns ×
     */ 
    tagStyleAddition = (tag, size) => {
        // スタイル適応繰り返し
        for (let i = 0; i < tag.length; i++) {
            // 開始ポジション
            let pos_x = Math.floor(Math.random() * (size * 0.5));
            let pos_y = Math.floor(Math.random() * (size * 0.5));
            // アニメーション
            let animation_sec = Math.floor((Math.random() * 10) + 6);
            let animation_kind = '';
            // アニメーション振り分け
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
                case 9: animation_kind = 'tag_move_0';
                        break;
                default: animation_kind = 'tag_move_0';
                        break;
            }
            // スタイルセット
            tag[i].style.webkitTransitionProperty = "-webkit-transform";
            tag[i].style.webkitTransitionDelay = "0.2s";
            tag[i].style.webkitTransitionDuration = "0.5s";
            tag[i].style.webkitTransitionTimingFunction = "ease-in-out";
            tag[i].style.position = 'absolute';
            tag[i].style.top = pos_x + 'px';
            tag[i].style.left = pos_y + 'px';
            tag[i].style.width = size + 'px';
            tag[i].style.height = size + 'px';
            tag[i].style.animationName = animation_kind;
            tag[i].style.webkitAnimationDuration = animation_sec + 's';
            tag[i].style.webkitAnimationIterationCount = 'infinite';
        }
    }
    
    render() {
        // TD・TR数に応じてテーブル作成
        const TD_NUM = this.state.TD_NUM;
        const TR_NUM = this.state.TR_NUM;
        const MAIN_TABLE = this.renderTable(TD_NUM, TR_NUM);

        return (
            <div id="main">
                <div dangerouslySetInnerHTML={{__html: MAIN_TABLE}}/>
                <EventListener target="window" onResize={this.calculateTable} />
            </div>
        )
    }
}

export default ViewChat