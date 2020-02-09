//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let article = req.params.article;
    let p_lang_id = req.params.id;
    article = article.replace(/\'/g, "\\'");
    article = article.replace(/\\/g, "\\\\");

    const INS_TRIVIA_Q = dbQuery.insTrivia(p_lang_id, article);
    dbConf.connection.query(INS_TRIVIA_Q, (err) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                res: true
            })
        }
    });
}