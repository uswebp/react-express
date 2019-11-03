import React, { Component } from "react";
import EventListener from 'react-event-listener';
import df from '../config/define';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TABLE_SIZE_WIDTH: Math.floor(window.innerWidth * 0.9 / 10) * 10,
            TABLE_SIZE_HEIGHT: Math.floor(window.innerWidth * 0.7 / 10) * 10,
            recentlyLangs: [],
            TAG_NUM: 0,
            TAG_SIZE: 0,
            TR_NUM: 0,
            TD_NUM: 0,
            TAG_RANDUM: [],
            FULL_TD_NUM: 0,
        };
    }
    UNSAFE_componentWillMount() {
        let tag_full = this.tableCal();
        this.getTagNum(tag_full);
    }
    componentDidMount() {
        const TAG_SIZE = this.state.TAG_SIZE;
        const TAG_NUM = this.state.TAG_NUM;
        const FULL_TD_NUM = this.state.FULL_TD_NUM;
        this.tagDomSet(TAG_SIZE,FULL_TD_NUM,TAG_NUM);
    }
    componentDidUpdate() {
    }
    // テーブル計算
    tableCal = () => {
        let table_size_width = Math.floor(window.innerWidth * 0.9 / 10) * 10;
        let table_size_height = Math.floor(window.innerHeight * 0.7 / 10) * 10;
        let tag_size = 0;
        let td_num = 0;
        let tr_num = 0;
        // td数
        if(table_size_width >= 450 && table_size_width < 600) {
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
        let tag_width = (table_size_width / td_num) * 0.6;
        let tag_height = (table_size_height / tr_num) * 0.6;
        let tag_num = Math.floor((td_num * tr_num) * 0.8);
        let full_td = td_num * tr_num;
        if (tag_width >= tag_height) {
            tag_size = Math.floor(tag_height);
        } else {
            tag_size = Math.floor(tag_width);
        }
        
        this.setState({ TD_NUM: td_num });
        this.setState({ TR_NUM: tr_num });
        this.setState({ FULL_TD_NUM: full_td });
        this.setState({ TAG_SIZE: tag_size });
        this.setState({ TAG_NUM: tag_num });
        this.setState({ TABLE_SIZE_WIDTH: table_size_width });
        this.setState({ TABLE_SIZE_HEIGHT: table_size_height });
        this.tagDomSet(tag_size, full_td, tag_num);

        return full_td;
    }

    getTagNum = (full_td) => {
        fetch(df.FULL_LOCAL_URL + ':' + df.SERVER_PORT + '/tagrandum/' + full_td)
          .then(response => response.json())
          .then((data) => {
            this.setTagNum(data.randum);
          })
          .catch(err => console.error(err))
    }
    // タグの乱数セット
    setTagNum = (data) => {
        this.setState({ TAG_RANDUM: data });
    }

    renderTable(d, r) {
        let tableWidth = this.state.TABLE_SIZE_WIDTH;
        let tableHeight = this.state.TABLE_SIZE_HEIGHT;
        let trwidth = tableWidth;
        let trheight = Math.floor(tableHeight / r);
        let tdwidth = Math.floor(tableWidth / d);
        let tdheight = trheight;

        let table = "<div style='width: " + tableWidth + "px;height: " + tableHeight +"px;' class='trvia-table'>";
        let num = 0;
        for (let i = 0; i < r; i++) {
            table += "<div class='trvia-tr' style='width: " + trwidth + "px;height: " + trheight + "px;' >";
            for (let j = 0; j < d; j++) {
                table += "<div class='trvia-td n_" + num + "' style='width: " + tdwidth + "px;height: " + tdheight + "px; '></div>";
                num++;
            }
            table += "</div>";
        }
        table += "</div>";

        return table;
    }
    
    //タグ出現
    tagDomSet(size, full, tag_num) {
        let triviaTd = document.querySelectorAll('.trvia-td');
        console.log(triviaTd);
        let randum_a = this.getRandomArr(triviaTd.length);
        for (let i = 0; i < triviaTd.length; i++) {
            while (triviaTd[i].firstChild) {
                triviaTd[i].removeChild(triviaTd[i].firstChild);
            }
        }
        console.log(randum_a);
        for (let i = 0; i < triviaTd.length; i++) {
            if (i === tag_num) {
                break;
            }
            let tn = randum_a[i];
            let div = document.createElement('div');
            div.classList.add('trivia-tag');
            div.classList.add('tag_' + i);
            triviaTd[tn].appendChild(div);
        }
        //生成した後タグを取得
        let triviaTag = document.querySelectorAll('.trivia-tag');

        for (let i = 0; i < triviaTag.length; i++) {
            let trans_pos_x = Math.random() * (size * 0.5);
            let trans_pos_y = Math.random() * (size * 0.5);
            let sec =(Math.random() * 10) + 5;
            let ani_sel='';

            if ((i%2) === 0) {
                ani_sel = 'tag_yure2';
            } else {
                ani_sel = 'tag_yure1';
            }
            // タグにスタイル適用
            triviaTag[i].style.webkitTransitionProperty = "-webkit-transform";
            triviaTag[i].style.webkitTransitionDelay = "0.2s";
            triviaTag[i].style.webkitTransitionDuration = "0.5s";
            triviaTag[i].style.webkitTransitionTimingFunction = "ease-out";
            triviaTag[i].style.webkitTransform = 'translate(' + trans_pos_x + 'px,' + trans_pos_y + 'px)';
            triviaTag[i].style.position = 'absolute';
            triviaTag[i].style.top = trans_pos_x + 'px';
            triviaTag[i].style.left = trans_pos_y + 'px';
            triviaTag[i].style.width = size + 'px';
            triviaTag[i].style.height = size + 'px';
            triviaTag[i].style.animationName = ani_sel;
            triviaTag[i].style.webkitAnimationDuration  = sec + 's';
            triviaTag[i].style.webkitAnimationIterationCount  = 'infinite';
        }
    }

    // ランダム生成
    getRandomArr(num) {
        // 乱数配列
        let randoms = [];
        // 最大と最小
        let min = 0, max = num-1;
        // 重複チェックしながら乱数作成
        for (let i = min; i <= max; i++) {
            while (true) {
                let tmp = this.intRandom(min, max);
                if (!randoms.includes(tmp)) {
                randoms.push(tmp);
                break;
                }
            }
        }
        return randoms;
    }

    intRandom(min, max) {
        return Math.floor( Math.random() * (max - min + 1)) + min;
    }
    
    render() {
        const TD_NUM = this.state.TD_NUM;
        const TR_NUM = this.state.TR_NUM;

        const MAIN_TABLE = this.renderTable(TD_NUM, TR_NUM);
        return (
            <div id="main">
                <div dangerouslySetInnerHTML={{__html: MAIN_TABLE}}/>
                <EventListener target="window" onResize={this.tableCal} />
            </div>
        )
    }
}

export default Cell