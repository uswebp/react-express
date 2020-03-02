//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let search_word = req.params.word;
    let search_p_lang = req.params.id;
    let page_num = req.params.page;
    let limit_num = req.params.limit;
    let order = req.params.order;

    search_word = search_word.replace(/\'/g, "\\'");
    search_word = search_word.replace(/\"/g, '\\"');
    search_word = search_word.replace(/\\/g, '\\\\\\');
    const GET_TRIVIA_TABLE_Q = dbQuery.getsearchTriviaWhere(search_word, search_p_lang, page_num, limit_num, order);
    dbConf.connection.query(GET_TRIVIA_TABLE_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                trivia: results
            })
        }
    });
}