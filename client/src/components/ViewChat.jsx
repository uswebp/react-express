/*=======================================================================
 import
=======================================================================*/
import React, { Component } from "react";
import EventListener from 'react-event-listener';
import df from '../config/define';
import { get } from "http";
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
        let total_td = this.state.TOTAL_TD;
        // Fetch・DOM操作
        this.installationGetTag(total_td);
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
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/trivia/'+ trivia_num)
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

    onMouseOver = (trivia_tag, tag_content) => {
        trivia_tag.addEventListener('mouseover', function() {
            // console.log(trivia_tag);
            // console.log(trivia_tag.querySelector('.trivia-name'));
            // trivia_tag.style.borderRadius = '10px';
            // trivia_tag.style.height = (trivia_tag.style.height.replace('px', '')) * 3 + 'px';
            // trivia_tag.style.width = (trivia_tag.style.width.replace('px', '')) * 4 + 'px';
            // trivia_tag.style.webkitTransform = 'scale(3)';
            trivia_tag.classList.remove('tag_move_0');
            trivia_tag.style.webkitTransform = ' ';
            trivia_tag.style.transform = ' ';
            trivia_tag.style.animation = 'AAA' + ' .1s ';
            // trivia_tag.style.webkitTransitionProperty = "-webkit-transform";
            // trivia_tag.style.webkitTransitionDelay = "0.2s";
            // trivia_tag.style.webkitTransitionDuration = "0.5s";
            // trivia_tag.style.webkitTransitionTimingFunction = "ease-in-out";
            trivia_tag.addEventListener('animationend',function(){
                trivia_tag.style.webkitTransform = 'scale(3)';
                console.log('end...');
            });
            trivia_tag.classList.add('mouse-on-tag');


            // trivia_tag.style.webkitTransition = 'all 0.5s ease-in-out';

            console.log('style set3');
            console.log(trivia_tag.style.webkitTransition);



        })
    }

    onMouseOut = (trivia_tag) => {
        trivia_tag.addEventListener('mouseout', function() {
            // if(trivia_tag.className.length >= 30){
                trivia_tag.classList.remove('mouse-on-tag');
                trivia_tag.classList.add('tag_move_0');
                let animation_move_sec = Math.floor((Math.random() * 10) + 6);
                // trivia_tag.classList.add(animation_kind);
                trivia_tag.style.animationName  = 'tag_move_0';
                trivia_tag.style.animationIterationCount  = 'infinite';
                trivia_tag.style.animationDuration =  animation_move_sec + 's';
                trivia_tag.style.animationDirection = 'alternate';
                trivia_tag.style.webkitTransition = 'all 0.5s ease-in-out';


            // }
    })
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
        if(randum_array){
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
                    // 豆知識情報セット
                    let p_lang_name = trivia[i].p_lang_name;
                    let trivia_id = trivia[i].trivia_id;
                    let p_lang_color_code = trivia[i].p_lang_color_code;
                    let article = trivia[i].article;

                    tag_content[i]=[];

                    tag_content[i].push(p_lang_name);
                    tag_content[i].push(trivia_id);
                    tag_content[i].push(p_lang_color_code);
                    tag_content[i].push(article);



                    // 乱数取り出し
                    let tn = randum_array[i];
                    // タグを生成後、配置
                    let div = document.createElement('div');
                    let span = document.createElement('span');
                    div.classList.add('trivia-tag');
                    div.classList.add('tag-id-' + trivia_id);
                    span.classList.add('trivia-name');
                    // プログラミング言語セット
                    trivia_td[tn].appendChild(div).appendChild(span).innerText = p_lang_name;
                    // プログラミング言語カラーセット
                    trivia_td[tn].querySelector('.trivia-tag').style.backgroundColor = '#' + p_lang_color_code;
                }
                // 生成した後タグを取得
                let trivia_tag = document.querySelectorAll('.trivia-tag');
                // タグにスタイル適応
                this.tagStyleAddition(trivia_tag, tag_size, tag_content);
            }
        }
    }
    /**
     * @description タグのスタイル適応処理(CSSアニメーション振り分け含む)
     * @param {Object} trivia_tag | 生成された豆知識タグ要素
     * @param {Int} tag_size | タグの大きさ
     * @returns ×
     */
    tagStyleAddition = (trivia_tag, tag_size, tag_content) => {
        console.log(tag_content);
        // スタイル適応繰り返し
        for (let i = 0; i < trivia_tag.length; i++) {
            // 開始ポジション
            let pos_x = Math.floor(Math.random() * (tag_size * 0.5));
            let pos_y = Math.floor(Math.random() * (tag_size * 0.5));
            // アニメーション
            let animation_move_sec = Math.floor((Math.random() * 10) + 6);
            let animation_view_sec = Math.floor((Math.random() * 5) + 3);
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
                case 9: animation_kind = 'tag_move_9';
                        break;
                default: animation_kind = 'tag_move_0';
                        break;
            }
            // スタイルセット
            trivia_tag[i].style.webkitTransitionProperty = "-webkit-transform";
            trivia_tag[i].style.webkitTransitionProperty = "all";
            trivia_tag[i].style.webkitTransitionDelay = "0.2s";
            trivia_tag[i].style.webkitTransitionDuration = "0.5s";
            trivia_tag[i].style.webkitTransitionTimingFunction = "ease-in-out";

            trivia_tag[i].style.position = 'absolute';
            trivia_tag[i].style.top = pos_x + 'px';
            trivia_tag[i].style.left = pos_y + 'px';
            trivia_tag[i].style.width = tag_size + 'px';
            trivia_tag[i].style.height = tag_size + 'px';
            trivia_tag[i].style.animation = 'tagview ' + animation_view_sec + 's 1';
            // trivia_tag[i].classList.add('tagview');
            // trivia_tag[i].style.animation = animation_view_sec + 's 1';
            animation_kind = 'tag_move_0';
            // タグの出現が終わり次第動かす
            trivia_tag[i].addEventListener('animationend',function(){
                let temp = trivia_tag[i].className;

                trivia_tag[i].style.animationName = '';
                if(temp.length <= 30){
                    trivia_tag[i].classList.add(animation_kind);
                    trivia_tag[i].style.animationIterationCount  = 'infinite';
                    trivia_tag[i].style.animationDuration = animation_move_sec + 's';
                    trivia_tag[i].style.animationDirection = 'alternate';
                    trivia_tag[i].style.webkitTransition = 'all 0.5s ease-in-out';
                }
            });

            this.onMouseOver(trivia_tag[i], tag_content[i]);

            this.onMouseOut(trivia_tag[i]);
        }
    }

    render() {
        // TD・TR数に応じてテーブル作成
        let d = this.state.TD_NUM;
        let r = this.state.TR_NUM;
        const MAIN_TABLE = this.renderTable(d, r);

        return (
            <div id="main">
                <div dangerouslySetInnerHTML={{__html: MAIN_TABLE}}/>
                <EventListener target="window" onResize={this.calculateTable} />
            </div>
        )
    }
}

export default ViewChat