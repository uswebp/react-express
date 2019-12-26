//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let word = req.params.word;
    let id = req.params.id;
    let page = req.params.page;
    let limit = req.params.limit;
    let order = req.params.order;

    word = word.replace(/\'/g, "\\'");
    word = word.replace(/\"/g, '\\"');
    word = word.replace(/\\/g, '\\\\\\');
    console.log(word);
    const GET_TRIVIA_TABLE_Q = dbQuery.getsearchTriviaWhere(word, id, page, limit, order);
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