// db_query_functions

// 豆知識10件取得
exports.getTrivia = () => {
    let sql = 'SELECT * FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'ORDER BY tr.ins_dt DESC ';
        sql += 'limit 12';

    return sql;
}

// 豆知識登録
exports.insTrivia = (p_lang_id, article) => {
    let sql = 'INSERT INTO trivia_table SET ';
        sql += 'p_lang_id = ' +  p_lang_id ;
        sql += ',lang_id = 1 ';
        sql += ',article = ' + "'" + article + "'";
        sql += ',upd_dt = now() ' ;
        sql += ',ins_dt = now() ' ;

    return sql;
}

// PG言語色取得 => 言語IDに対して
exports.getSPcolor = (p_lang_id) => {
    let sql = 'SELECT * FROM p_lang_mst ';
        sql += 'WHERE p_lang_id = ' + p_lang_id;

    return sql;
}

exports.getRandomArr = () => {
    /** 重複チェック用配列 */
    var randoms = [];
    /** 最小値と最大値 */
    var min = 1, max = 10;
    
    /** 重複チェックしながら乱数作成 */
    for(i = min; i <= max; i++){
    while(true){
        var tmp = intRandom(min, max);
        if(!randoms.includes(tmp)){
        randoms.push(tmp);
        break;
        }
    }
    }
    return randoms;
    
    /** min以上max以下の整数値の乱数を返す */
    function intRandom(min, max){
    return Math.floor( Math.random() * (max - min + 1)) + min;
    }
}