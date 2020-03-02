//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req, res) {
    const SELECT_ALL_P_LANG_Q = 'SELECT * FROM p_lang_mst';
    dbConf.connection.query(SELECT_ALL_P_LANG_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                color: results
            })
        }
    });
}