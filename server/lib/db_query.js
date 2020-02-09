/*=================================================================================
 DB操作に関する関数集
=================================================================================*/
/**
 * @description 豆知識を取得するSQL文を生成
 * @param {Int} limit_num | 取得する豆知識の数
 * @returns {String} sql | 豆知識取得SQL文
 */
exports.getTrivia = (limit_num) => {
    let sql =  'SELECT * FROM trivia_table AS TR ';
        sql += 'LEFT JOIN p_lang_mst AS PM ';
        sql += 'ON TR.p_lang_id = PM.p_lang_id ';
        sql += 'ORDER BY TR.ins_dt DESC ';
        sql += 'LIMIT ' + limit_num;

    return sql;
}
/**
 * @description 豆知識を登録するSQL文を生成
 * @param {Int} p_lang_id | プログラミング言語のカラー番号
 * @param {Int} article | 豆知識投稿内容
 * @returns {String} sql | 豆知識登録SQL文
 */
exports.insTrivia = (p_lang_id, article) => {
    let sql =  'INSERT INTO trivia_table SET ';
        sql += 'p_lang_id = ' + p_lang_id;
        sql += ',lang_id = 1 ';
        sql += ',article = ' + "'" + article + "'";
        sql += ',upd_dt = now() ';
        sql += ',ins_dt = now() ';

    return sql;
}
/**
 * @description 言語IDに対してPG言語色取得
 * @param {Int} p_lang_id | プログラミング言語のカラー番号
 * @returns {String} sql | プログラミング言語のカラー取得SQL文
 */
exports.getSPcolor = (p_lang_id) => {
    let sql =  'SELECT * FROM p_lang_mst ';
        sql += 'WHERE p_lang_id = ' + p_lang_id;

    return sql;
}
/**
 * @description trivia_tableから最近投稿された言語のp_lang_idを10個取得する
 * @param {Int} limit_num | 取得する豆知識の数
 * @returns {String} sql | 豆知識取得SQL文
 */
exports.getRecentlyLang = (limit_num) => {
    let sql =  'SELECT p_lang_id FROM ';
        sql += 'trivia_table GROUP BY p_lang_id ';
        sql += 'ORDER BY MAX(ins_dt) DESC LIMIT ' + limit_num;

    return sql;
}
/**
 * @description ページング用SQL文
 * @param {Int} page_num | ページ番号
 * @param {Int} limit_num | 表示件数
 * @returns {String} sql | 豆知識取得SQL文
 */
exports.getTriviaArticle = (page_num, limit_num) => {
    // 表示件数の開始位置を算出
    let offset = ((page_num * limit_num) - limit_num);
    let sql =  'SELECT * FROM trivia_table AS TR ';
        sql += 'LEFT JOIN p_lang_mst AS PM ';
        sql += 'ON TR.p_lang_id = PM.p_lang_id ';
        sql += 'ORDER BY TR.trivia_id ASC ';
        sql += 'LIMIT ' + limit_num + ' OFFSET ' + offset;

    return sql;
}
/**
 * @description 検索された豆知識を返すSQL文
 * @param {Int} search_word | 検索ワード
 * @param {Int} search_p_lang | 検索プログラミング言語
 * @param {Int} page_num | ページ番号
 * @param {Int} limit_num | 表示件数
 * @param {Int} order | 並び替え条件
 * @returns {String} sql | 豆知識件数取得SQL文
 */
exports.getsearchTriviaWhere = (search_word, search_p_lang, page_num, limit_num, order) => {
    // 表示件数の開始位置を算出
    let offset = ((page_num * limit_num) - limit_num);
    // 余分な空白を取り除く
    search_word_shp = search_word.trim();

    let sql =  'SELECT *,TR.ins_dt AS ins_t FROM trivia_table AS TR ';
        sql += 'LEFT JOIN p_lang_mst AS PM ';
        sql += 'ON TR.p_lang_id = PM.p_lang_id ';
        sql += 'WHERE 1 = 1 ';
        // 検索ワードが空文字以外の時条件に含める
        if (search_word_shp) {
            sql += 'AND TR.article LIKE "%' + search_word_shp + '%" ';
        }
        // 検索プログラミング言語が「全て」以外の時条件に含める
        if (search_p_lang !== 'all' ) {
            sql += 'AND TR.p_lang_id = ' + search_p_lang;
        }
        // 並び替え条件
        if (order === 'default' || order === 'date_desc') {
            sql += ' ORDER BY TR.trivia_id DESC ';
        }
        if (order === 'date_asc') {
            sql += ' ORDER BY TR.trivia_id ASC ';
        }

        sql += 'LIMIT ' +  limit_num + ' OFFSET ' + offset;

    return sql;
}
/**
 * @description 検索された豆知識の数を返すSQL文
 * @param {Int} search_word | 検索ワード
 * @param {Int} search_p_lang | 検索プログラミング言語
 * @returns {String} sql | 豆知識件数取得SQL文
 */
exports.getTriviaCount = (search_word, search_p_lang) => {
    // 余分な空白を取り除く
    search_word_shp = search_word.trim();
    let sql =  'SELECT count(*) AS cnt FROM trivia_table ';
        sql += 'WHERE 1 = 1 ';
    // 検索ワードが空文字以外の時条件に含める
    if (search_word_shp !== '') {
        sql += 'AND article LIKE "%' + search_word_shp + '%" ';
    }
    // 検索プログラミング言語が「全て」以外の時条件に含める
    if (search_p_lang && search_p_lang !== 'all') {
        sql += 'AND p_lang_id = ' + search_p_lang;
    }
    return sql;
}

