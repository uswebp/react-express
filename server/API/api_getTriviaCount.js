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
    search_word = search_word.replace(/\'/g, "\\'");
    search_word = search_word.replace(/\"/g, '\\"');
    search_word = search_word.replace(/\\/g, '\\\\\\');

    const GET_TRIVIA_TABLE_Q = dbQuery.getTriviaCount(search_word, search_p_lang);
    dbConf.connection.query(GET_TRIVIA_TABLE_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                count: results
            })
        }
    });
}