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
    let off = ((page * limit_n) - limit_n);
    let sql = 'SELECT * FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'ORDER BY tr.trivia_id ASC ';
        sql += 'limit ' +  limit_n + ' offset ' + off;

    return sql;
}
exports.getTriviaCount = (search_word, search_pg) => {
    search_word = search_word.trim();
    let sql = 'SELECT count(*) as cnt FROM trivia_table ';
        sql += 'WHERE 1 = 1 ';

    if (search_word !== '') {
        sql += 'AND article LIKE "%' + search_word + '%" ';
    }
    if (search_pg && search_pg !== 'all') {
        sql += 'AND p_lang_id = ' + search_pg;
    }
    return sql;
}
exports.getTriviaCountChk = (search_word, search_pg) => {
    search_word = search_word.trim();

    let id_arr = [];

    if (search_pg.indexOf('all') === -1) {
        id_arr = search_pg.split('_');
        id_arr.pop();
    }

    let sql = 'SELECT count(*) as cnt FROM trivia_table ';
        sql += 'WHERE 1 = 1 ';

        if (search_word) {
            sql += 'AND article LIKE "%' + search_word + '%" ';
        }

        if (search_pg.indexOf('all') === -1 ) {
            for (let i = 0; i < id_arr.length; i++) {
                if (i === 0) {
                    sql += ' AND (p_lang_id =' + id_arr[i];
                } else {
                    sql += ' OR p_lang_id = ' + id_arr[i];
                }
            }
            sql += ') ';
        }
    return sql;
}

exports.getsearchTriviaWhere = (word, id, page, limit, order) => {
    let off = ((page * limit) - limit);
    word = word.trim();
    console.log(word);

    let sql = 'SELECT *,tr.ins_dt as ins_t FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'WHERE 1=1 '
        if (word) {
            sql += 'AND tr.article LIKE "%' + word + '%" ';
        }
        if (id.indexOf('all') === -1 ) {
            sql += 'AND tr.p_lang_id = ' + id;
        }

        if (order === 'default' || order === 'date_desc') {
            sql += ' ORDER BY tr.trivia_id DESC ';
        }
        if (order === 'date_asc') {
            sql += ' ORDER BY tr.trivia_id ASC ';
        }

        sql += 'limit ' +  limit + ' offset ' + off;

        // console.log(sql);
    return sql;
}

exports.getCheckBoxTrivia = (word, id, page, limit) => {
    let off = ((page * limit) - limit);
    word = word.trim();
    let id_arr = [];

    if (id.indexOf('all') === -1) {
        id_arr = id.split('_');
        id_arr.pop();
    }

    let sql = 'SELECT * FROM trivia_table AS tr ';
        sql += 'LEFT JOIN p_lang_mst AS pm ';
        sql += 'ON tr.p_lang_id = pm.p_lang_id ';
        sql += 'WHERE 1=1 '
        if (word) {
            sql += 'AND tr.article LIKE "%' + word + '%" ';
        }

        if (id.indexOf('all') === -1 ) {
            for (let i = 0; i < id_arr.length; i++) {
                if (i === 0) {
                    sql += ' AND (tr.p_lang_id =' + id_arr[i];
                } else {
                    sql += ' OR tr.p_lang_id = ' + id_arr[i];
                }
            }
            sql += ') ';
        }
        sql += ' ORDER BY tr.trivia_id ASC ';
        sql += 'limit ' +  limit + ' offset ' + off;

        console.log(sql);
    return sql;
}


