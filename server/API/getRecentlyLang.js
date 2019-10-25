//======================================================================
// set up
//======================================================================
const dbConf = require('../dbManager');
const dbQuery = require('../../lib/db_query');
const define = require('../../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    const SELECT_ALL_REACT_TEST_Q = dbQuery.getRecentlyLang(define.TOP_VIEW_TOTAL_NUMBER);
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                recently_p_langs: results
            })
        }
    });
}