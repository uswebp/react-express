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

