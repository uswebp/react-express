/*=================================================================================
 DB操作に関する関数集
/*=================================================================================
/**
 * @description 豆知識を取得するSQL文を生成
 * @param {Int} limit_n | 取得する豆知識の数
 * @returns {String} sql | 豆知識取得SQL文
 */
exports.getTrivia = (limit_n) => {
    let sql = 'SELECT * FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'ORDER BY tr.ins_dt DESC ';
        sql += 'limit ' + limit_n;

    return sql;
}
/**
 * @description 豆知識を登録するSQL文を生成する
 * @param {Int} p_lang_id | プログラミング言語のカラー番号
 * @param {Int} article | 豆知識投稿内容
 * @returns {String} sql | 豆知識登録SQL文
 */
exports.insTrivia = (p_lang_id, article) => {
    let sql = 'INSERT INTO trivia_table SET ';
        sql += 'p_lang_id = ' + p_lang_id;
        sql += ',lang_id = 1 ';
        sql += ',article = ' + "'" + article + "'";
        sql += ',upd_dt = now() ';
        sql += ',ins_dt = now() ';

    return sql;
}
/**
 * @description PG言語色取得 => 言語IDに対して
 * @param {Int} p_lang_id | プログラミング言語のカラー番号
 * @returns {String} sql | プログラミング言語のカラー取得SQL文
 */
exports.getSPcolor = (p_lang_id) => {
    let sql = 'SELECT * FROM p_lang_mst ';
        sql += 'WHERE p_lang_id = ' + p_lang_id;

    return sql;
}
/**
 * @description trivia_tableから最近投稿された言語のp_lang_idを10個取得する
 * @param {Int} limit_n | 取得する豆知識の数
 * @returns {String} sql | 豆知識取得SQL文
 */
exports.getRecentlyLang = (limit_n) => {
    let sql = 'SELECT p_lang_id FROM ';
        sql += 'trivia_table GROUP BY p_lang_id ';
        sql += 'ORDER BY MAX(ins_dt) DESC limit ' + limit_n;

    return sql;
}

exports.getTriviaArticle = (page, limit_n) => {
    let off = ((page * limit_n) - limit_n) + 1;
    let sql = 'SELECT * FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'ORDER BY tr.trivia_id ASC ';
        sql += 'limit ' +  limit_n + ' offset ' + off;

    return sql;
}
exports.getTriviaCount = () => {
    let sql = 'SELECT count(*) as cnt FROM trivia_table';

    return sql;
}
