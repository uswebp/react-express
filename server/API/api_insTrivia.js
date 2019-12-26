//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let article = req.params.article;
    article = article.replace(/\'/g, "\\'");
    article = article.replace(/\\/g, "\\\\");

    let p_lang_id = req.params.id;
    const INS_TRIVIA = dbQuery.insTrivia(p_lang_id, article);
    console.log(INS_TRIVIA);
    dbConf.connection.query(INS_TRIVIA, (err) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                res: true
            })
        }
    });
}